from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservation/confirm/<int:id>/', view=views.confirmReservation, name="Confirm Reservation"),
    path('finalize/<int:id>/', view=views.finalize,name="Finalize"),
    path('upload/', view=views.upload, name="Upload"),
    path('reservation/delete/<int:id>/',view=views.deleteConfirmedReservation, name = "Delete Confirmed Resrvation"),

]