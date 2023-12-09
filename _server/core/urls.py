from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservation/delete/<int:id>/',view=views.deleteReservationRequest, name="Delete Reservation Request"),
    path('reservation/update/<int:id>/',view=views.updateReservationRequest, name="Update Reservation Request"),
    path('reservation/request/',view=views.createReservationRequest, name="Create Reservation Request"),
    path('reservation/confirmed/',view=views.getConfirmedReservations, name = "Get Confirmed Resrvations"),
    path('vault/',view=views.getVault,name="Get Vault"),
    path('image/<int:id>/<str:img>/',view=views.getImage,name="Get Image"),
    path('image/<int:id>/<str:img>/thumb/',view=views.get_thumbnail,name="Get Thumbnail"),
    path('zip/',view=views.zip,name="Zip"),
    path('sampleVault/',view=views.getSampleVault, name="Get Sample Vault"),
    path('sample/<str:img>', view=views.getSample, name= "Get Sample"),
    path("icon/", view=views.getIcon, name="Icon"),
]