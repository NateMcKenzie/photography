import json
import os
from django.shortcuts import render
from django.conf  import settings
from django.http import JsonResponse
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
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    print("Sending react app")
    return render(req, "core/index.html", context)

@login_required
def createReservation(req):
    body = json.loads(req.body)
    reservation = ReservationRequest(
        user = req.user,
        openDate = body["openDate"],
        closeDate = body["closeDate"],
        location = body["location"],
        shootType = body["shootType"],
        notes = body["notes"]
    )
    reservation.save()
    return JsonResponse({"reservation":model_to_dict(reservation)})