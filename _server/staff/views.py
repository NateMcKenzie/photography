from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
from django.contrib.auth.models import User
from core.models import ReservationConfirmed, ReservationRequest


# Create your views here.
@staff_member_required
def index(req: HttpRequest):
    pendingRequests = ReservationRequest.objects.all()
    confirmedReservations = ReservationConfirmed.objects.all()
    return render(req, "staff/index.html", {"pendingRequests":pendingRequests,"confirmedReservations":confirmedReservations})


@staff_member_required
def confirmReservation(req: HttpRequest):
    user=req.POST.get("user")
    user = User.objects.get(id=user)
    date=req.POST.get("date")
    time=req.POST.get("time")
    location=req.POST.get("location")
    shootType=req.POST.get("shootType")
    notes=req.POST.get("notes")
    newReservation = ReservationConfirmed(
        user=user,
        date=date,
        time=time,
        location=location,
        shootType=shootType,
        notes=notes
    )
    try:
        newReservation.save()
    except:
        pass
    return redirect("/staff/")
