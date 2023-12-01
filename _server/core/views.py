import json
import os
import zipfile
from django.shortcuts import render
from django.conf import settings
from django.http import (
    JsonResponse,
    HttpRequest,
    FileResponse,
    HttpResponseForbidden,
    HttpResponse,
)
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from .models import ReservationRequest, ReservationConfirmed

FILE_EXTENSION = ".jpg"
VAULT_PATH = os.environ.get("VAULT_PATH", "")
SAMPLE_PATH = os.environ.get("SAMPLE_PATH", "")
TMP_PATH = os.environ.get("TMP_PATH", "")

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
def deleteReservation(req: HttpRequest, id):
    reservation = ReservationRequest.objects.get(id=id)
    if reservation.user == req.user:
        reservation.delete()
        return getReservationRequests(req)
    else:
        return HttpResponseForbidden(
            'You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>'
        )


@login_required
def createReservationRequest(req: HttpRequest):
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
    return getReservationRequests(req)


@login_required
def getConfirmedReservations(req: HttpRequest):
    reservationList = [
        model_to_dict(reservation)
        for reservation in req.user.reservationconfirmed_set.all()
    ]
    return JsonResponse({"reservationList": reservationList})


@login_required
def getReservationRequests(req: HttpRequest):
    # Return a list of reservation objects
    reservationList = [
        model_to_dict(reservation)
        for reservation in req.user.reservationrequest_set.all()
    ]
    return JsonResponse({"reservationList": reservationList})


def getSampleVault(req: HttpRequest):
    files = os.listdir(SAMPLE_PATH)
    URLs = []
    for file in files:
        URLs.append("/sample/" + file.removesuffix(FILE_EXTENSION))
    return JsonResponse({"imageURLs": URLs})


def getSample(req: HttpRequest, img):
    path = os.path.join(SAMPLE_PATH, img + FILE_EXTENSION)
    with open(path, "rb") as imageFile:
        return FileResponse(imageFile)


@login_required
def getVault(req: HttpRequest):
    user = req.user
    path = os.path.join(VAULT_PATH, str(user.id))
    files = os.listdir(path)
    URLs = []
    for file in files:
        URLs.append("/image/" + str(user.id) + "/" + file.removesuffix(FILE_EXTENSION))
    return JsonResponse({"imageURLs": URLs})


# TODO: Separate thumbnails and main pics.
@login_required
def getImage(req: HttpRequest, id, img):
    if req.user.id == id:
        path = os.path.join(VAULT_PATH, str(req.user.id), img + FILE_EXTENSION)
        with open(path, "rb") as imageFile:
            return FileResponse(imageFile)
    else:
        return HttpResponseForbidden(
            'You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>'
        )


@login_required
def zip(req: HttpRequest):
    # Parse request and verify access
    body = json.loads(req.body)
    imageRequests = []
    for URL in body:
        splitURL = URL.split("/")
        if int(splitURL[2]) != req.user.id:
            return HttpResponseForbidden()
        else:
            userID = splitURL[2]
            imageRequests.append(splitURL[3])

    # Zip requested files
    userVaultPath = os.path.join(VAULT_PATH, str(userID))
    zippedPath = os.path.join(TMP_PATH, userID + ".zip")
    with zipfile.ZipFile(zippedPath, "w") as zipper:
        for image in imageRequests:
            imagePath = os.path.join(userVaultPath, image + FILE_EXTENSION)
            zipper.write(
                imagePath,
                compress_type=zipfile.ZIP_DEFLATED,
                arcname=image + FILE_EXTENSION,
            )

    with open(zippedPath, "rb") as zippedFile:
        return FileResponse(zippedFile)
