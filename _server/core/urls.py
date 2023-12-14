from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservation/delete/<int:id>/',view=views.delete_reservation_request, name="Delete Reservation Request"),
    path('reservation/update/<int:id>/',view=views.update_reservation_request, name="Update Reservation Request"),
    path('reservation/request/',view=views.create_reservation_request, name="Create Reservation Request"),
    path('reservation/confirmed/',view=views.get_confirmed_reservations, name = "Get Confirmed Resrvations"),
    path('vault/',view=views.get_vault,name="Get Vault"),
    path('image/<int:id>/<str:img>/',view=views.get_image,name="Get Image"),
    path('image/<int:id>/<str:img>/thumb/',view=views.get_thumbnail,name="Get Thumbnail"),
    path('zip/',view=views.zip,name="Zip"),
    path('sampleVault/',view=views.get_sample_vault, name="Get Sample Vault"),
    path('sample/<str:img>', view=views.getSample, name= "Get Sample"),
    path("icon/", view=views.get_icon, name="Icon"),
]