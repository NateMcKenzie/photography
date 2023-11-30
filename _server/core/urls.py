from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservationRequests/',view=views.createReservationRequest, name="Create Reservation Request"),
    path('confirmedReservations/',view=views.getConfirmedReservations, name = "Get Confirmed Resrvations"),
    path('vault/',view=views.getVault,name="Get Vault"),
    path('image/<int:id>/<str:img>/',view=views.getImage,name="Get Image"),
    path('zip/',view=views.zip,name="Zip"),
]