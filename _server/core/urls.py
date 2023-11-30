from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservations/',view=views.createReservation, name="Create Reservation"),
    path('vault/',view=views.getVault,name="Get Vault"),
    path('image/<int:id>/<str:img>/',view=views.getImage,name="Get Image"),
    path('zip/',view=views.zip,name="Zip"),
]