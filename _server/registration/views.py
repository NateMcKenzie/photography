from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
import os

VAULT_PATH = os.environ.get("VAULT_PATH", "")

def welcome(req):
    return render(req, "registration/welcome.html")


# TODO: Username in use casues crash
def sign_up(req):
    if req.method == "POST":
        username = req.POST.get("email")
        password = req.POST.get("password")
        email = req.POST.get("email")
        first_name = req.POST.get("first_name")
        last_name = req.POST.get("last_name")

        if username and password and email and first_name and last_name:
            if User.objects.filter(email=username):
                return render(
                req,
                "registration/sign_up.html",
                {
                    "message": "Email is already in use",
                    "username": username,
                    "password": password,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                },
            )
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            login(req, user)
            create_vault(user)
            return redirect("/")
        else:
            return render(
                req,
                "registration/sign_up.html",
                {
                    "message": "Please fill out all fields",
                    "username": username,
                    "password": password,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                },
            )
    else:
        return render(req, "registration/sign_up.html")


def sign_in(req):
    if req.method == "POST":
        username = req.POST.get("email")
        password = req.POST.get("password")
        user = authenticate(req, username=username, password=password)
        if user is not None:
            login(req, user)
            return redirect("/")

        if User.objects.filter(email=username):
            message = "Incorrect Password"
        else:
            message = "Email Not Found"
        return render(
            req,
            "registration/sign_in.html",
            {
                "message": message,
                "email": username,
            },
        )
    else:
        return render(req, "registration/sign_in.html")


def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})

def create_vault(user):
    path = os.path.join(VAULT_PATH,str(user.id))
    os.mkdir(path)