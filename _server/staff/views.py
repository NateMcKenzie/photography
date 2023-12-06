from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponseBadRequest
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from core.models import ReservationConfirmed, ReservationRequest
from .forms import FileUploadForm
import datetime
import os
import zipfile


UPLOAD_PATH = os.environ.get("UPLOAD_PATH", "")
VAULT_PATH = os.environ.get("VAULT_PATH", "")
ZIPPED_PATH = os.path.join(UPLOAD_PATH, "upload.zip")


# Create your views here.
@staff_member_required
def index(req: HttpRequest):
    pendingRequests = ReservationRequest.objects.all()
    confirmedReservations = ReservationConfirmed.objects.all()
    return render(
        req,
        "staff/index.html",
        {
            "pendingRequests": pendingRequests,
            "confirmedReservations": confirmedReservations,
            "form": FileUploadForm(),
        },
    )


@staff_member_required
def finalize(req: HttpRequest, id):
    requested = ReservationRequest.objects.get(id=id)
    now = datetime.datetime.now()
    today = f"{now.year}-{str(now.month).zfill(2)}-{str(now.day).zfill(2)}"
    print(today)
    return render(
        req,
        "staff/finalize.html",
        {
            "requested": requested,
            "today": today,
            "now": f"{now.hour-7}:{now.minute}:00",
        },
    )


@staff_member_required
def confirmReservation(req: HttpRequest):
    user = req.POST.get("user")
    user = User.objects.get(id=user)
    date = req.POST.get("date")
    time = req.POST.get("time")
    location = req.POST.get("location")
    shootType = req.POST.get("shootType")
    notes = req.POST.get("notes")
    newReservation = ReservationConfirmed(
        user=user,
        date=date,
        time=time,
        location=location,
        shootType=shootType,
        notes=notes,
    )
    newReservation.save()
    return redirect("/staff/")


@staff_member_required
def upload(req: HttpRequest):
    form = FileUploadForm(req.POST, req.FILES)
    if form.is_valid():
        # Access the user
        email = form.cleaned_data["email"]
        user = User.objects.get(email=email)
        print(user)
        id = user.id

        # Access the file
        handle_uploaded_file(req.FILES["file"])
        extractPath = os.path.join(VAULT_PATH, str(id))
        with zipfile.ZipFile(ZIPPED_PATH, "r") as zipper:
            zipper.extractall(extractPath)
    else:
        return HttpResponseBadRequest("Error Uploading")

    return redirect("/staff/")


def handle_uploaded_file(f):
    with open(ZIPPED_PATH, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)
