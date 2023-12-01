from django.contrib import admin
from core.views import ReservationRequest, ReservationConfirmed
# Register your models here.
admin.site.register(ReservationRequest)
admin.site.register(ReservationConfirmed)