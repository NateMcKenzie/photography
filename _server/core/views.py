import json
import os
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpRequest, FileResponse,HttpResponseForbidden
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from .models import ReservationRequest

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)


# Create your views here.
@login_required
def index(req: HttpRequest):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0],
    }
    print("Sending react app")
    return render(req, "core/index.html", context)


@login_required
def createReservation(req: HttpRequest):
    if req.method == "POST":
        body = json.loads(req.body)
        reservation = ReservationRequest(
            user=req.user,
            openDate=body["openDate"],
            closeDate=body["closeDate"],
            location=body["location"],
            shootType=body["shootType"],
            notes=body["notes"],
        )
        reservation.save()
        return JsonResponse({"reservation": model_to_dict(reservation)})
    return getReservations(req)


@login_required
def getReservations(req: HttpRequest):
    # Return a list of reservation objects
    reservationList = [
        model_to_dict(reservation)
        for reservation in req.user.reservationrequest_set.all()
    ]
    return JsonResponse({"reservationList": reservationList})

@login_required
def getVault(req: HttpRequest):
    user = req.user
    path = os.path.join(os.environ.get("VAULT_PATH",""),str(user.id))
    files = os.listdir(path)
    print(files)
    URLs = []
    for file in files:
        URLs.append("/image/"+ str(user.id) + "/" + file.removesuffix(".png"))
    return JsonResponse({"imageURLs":URLs})

@login_required
def getImage(req: HttpRequest, id, img):
    if(req.user.id == id):
        path = os.path.join(os.environ.get("VAULT_PATH",""),str(req.user.id),img+".png")
        img = open(path, 'rb')
        return FileResponse(img)
    else:
        return HttpResponseForbidden('You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>')
