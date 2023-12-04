from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('reservation/confirm/', view=views.confirmReservation, name="Confirm Reservation"),
    path('finalize/<int:id>', view=views.finalize,name="Finalize")

]