from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings


# Create your views here.
@staff_member_required
def index(req: HttpRequest):
    print(req.user.is_staff)
    return render(req, "staff/index.html")