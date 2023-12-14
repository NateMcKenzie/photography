import json
import os
import zipfile
from PIL import Image
from django.shortcuts import render
from django.conf import settings
from django.http import (
    JsonResponse,
    HttpRequest,
    FileResponse,
    HttpResponseForbidden,
)
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from .models import ReservationRequest, ReservationConfirmed

FILE_EXTENSION = ".JPG"
THUMBNAIL_PATH = "thumbnails/"
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
    return render(req, "core/index.html", context)


@login_required
def delete_reservation_request(req: HttpRequest, id):
    reservation = ReservationRequest.objects.get(id=id)
    if reservation.user == req.user:
        reservation.delete()
        return get_reservation_requests(req)
    else:
        return HttpResponseForbidden(
            'You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>'
        )


@login_required
def create_reservation_request(req: HttpRequest):
    if req.method == "POST":
        body = json.loads(req.body)
        print(body["notes"])
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
    return get_reservation_requests(req)

@login_required
def update_reservation_request(req: HttpRequest, id):
    body = json.loads(req.body)
    reservation = ReservationRequest.objects.get(id=id)
    if(req.user == reservation.user):
        reservation.openDate=body["openDate"]
        reservation.closeDate=body["closeDate"]
        reservation.location=body["location"]
        reservation.shootType=body["shootType"]
        reservation.notes=body["notes"]
    reservation.save()
    return JsonResponse({"reservation": model_to_dict(reservation)})


@login_required
def get_confirmed_reservations(req: HttpRequest):
    reservationList = [
        model_to_dict(reservation)
        for reservation in req.user.reservationconfirmed_set.all()
    ]
    return JsonResponse({"reservationList": reservationList})


@login_required
def get_reservation_requests(req: HttpRequest):
    # Return a list of reservation objects
    reservationList = [
        model_to_dict(reservation)
        for reservation in req.user.reservationrequest_set.all()
    ]
    return JsonResponse({"reservationList": reservationList})


def get_sample_vault(req: HttpRequest):
    files = os.listdir(SAMPLE_PATH)
    URLs = []
    for file in files:
        URLs.append("/sample/" + os.path.splitext(file)[0])
    return JsonResponse({"imageURLs": URLs})


def getSample(req: HttpRequest, img):
    path = os.path.join(SAMPLE_PATH, img + FILE_EXTENSION)
    return FileResponse(open(path, "rb"))


@login_required
def get_vault(req: HttpRequest):
    user = req.user
    path = os.path.join(VAULT_PATH, str(user.id))
    files = os.listdir(path)
    files.remove(THUMBNAIL_PATH[:-1])
    URLs = []
    for file in files:
        URLs.append("/image/" + str(user.id) + "/" + os.path.splitext(file)[0])
    return JsonResponse({"imageURLs": URLs})

@login_required
def get_thumbnail(req, id, img):
    if req.user.id == id:
        vault = os.path.join(VAULT_PATH, str(req.user.id))
        thumb = os.path.join(vault, THUMBNAIL_PATH, img + FILE_EXTENSION)
        if os.path.exists(thumb):
            return FileResponse(open(thumb, "rb"))
        else:
            full = os.path.join(vault, img + FILE_EXTENSION)
            img = Image.open(full)
            img.thumbnail((300,300))
            img.save(fp=thumb)
            return FileResponse(open(thumb, "rb"))
    else:
        return HttpResponseForbidden(
            'You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>'
        )

@login_required
def get_image(req: HttpRequest, id, img):
    if req.user.id == id:
        path = os.path.join(VAULT_PATH, str(req.user.id), img + FILE_EXTENSION)
        return FileResponse(open(path, "rb"))
    else:
        return HttpResponseForbidden(
            'You are not logged in as this user. You may log in <a href="/registration/sign_in">here</a>'
        )


@login_required
def zip(req: HttpRequest):
    # Parse request and verify access
    body = json.loads(req.body)
    image_requests = []
    for URL in body:
        split_URL = URL.split("/")
        if int(split_URL[2]) != req.user.id:
            return HttpResponseForbidden()
        else:
            userID = split_URL[2]
            image_requests.append(split_URL[3])

    # Zip requested files
    user_vault_path = os.path.join(VAULT_PATH, str(userID))
    zipped_path = os.path.join(TMP_PATH, userID + ".zip")
    with zipfile.ZipFile(zipped_path, "w") as zipper:
        for image in image_requests:
            image_path = os.path.join(user_vault_path, image + FILE_EXTENSION)
            zipper.write(
                image_path,
                compress_type=zipfile.ZIP_DEFLATED,
                arcname=image + FILE_EXTENSION,
            )

    return FileResponse(open(zipped_path, "rb"))

def get_icon(req: HttpRequest):
    return FileResponse((open("camera.svg","rb")))
