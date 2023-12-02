from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ReservationRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    openDate = models.DateField()
    closeDate = models.DateField()
    location = models.TextField()
    shootType = models.TextField()
    notes = models.TextField()

class ReservationConfirmed(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    location = models.TextField()
    shootType = models.TextField()
    notes = models.TextField()