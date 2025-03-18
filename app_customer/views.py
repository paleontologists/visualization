from django.conf import settings
from visualization.settings import TEMPLATE_PATHS
from django.shortcuts import render, redirect
from django.contrib import messages
import os
from django.utils import timezone

# view for home page inlcuding the navigator
def home(request):
    username = request.session.get("username", "guest")
    return render(request, TEMPLATE_PATHS["home"], {"username": username})


# view for introduction iframe page
def introduction(request):
    return render(request, TEMPLATE_PATHS["introduction"])


# view for models iframe page
def models(request):
    return render(request, TEMPLATE_PATHS["models"])


# view for workspace iframe page
def workspace(request):
    return render(request, TEMPLATE_PATHS["workspace"])


# view for fo to customer login page
def login_customer(request):
    return render(request, TEMPLATE_PATHS["login-customer"])


# view for fo to customer register page
def register_customer(request):
    return render(request, TEMPLATE_PATHS["register"])


def contact_us(request):
    if request.method == "POST":
        # get user input
        name = request.POST.get("name", "Anonymous").strip() or "Anonymous"
        email = (
            request.POST.get("email", "No email provided").strip()
            or "No email provided"
        )
        message = request.POST.get("message", "").strip()

        if not message:
            messages.error(request, "Message cannot be empty.")
            return redirect("contact_us")

        # ensure media exist
        media_path = os.path.join("media", "contact_messages")
        os.makedirs(media_path, exist_ok=True)

        from datetime import datetime
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        file_path = os.path.join(media_path, filename)

        # write letter in the txt
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Message:\n{message}\n")

        messages.success(request, "Your message has been saved successfully!")
        return redirect("contact_us")
    return render(request, "customer/contact_us.html")


def about_us(request):
    return render(request, "customer/about_us.html")


def support_us(request):
    return render(request, "customer/support_us.html")


def support(request):
    return render(request, "customer/support.html")


def donate(request):
    return render(request, "customer/donate.html")


def donate(request):
    if request.method == "POST":
        payment_method = request.POST.get("payment_method")
        amount = request.POST.get("amount")
        card_number = request.POST.get("card_number")
        expiry_date = request.POST.get("expiry_date")
        cvv = request.POST.get("cvv")
        cardholder_name = request.POST.get("cardholder_name")

        # create folder for saving
        media_path = settings.MEDIA_ROOT
        if not os.path.exists(media_path):
            os.makedirs(media_path)

        # time for avoid name conflict
        filename = f'donation_{timezone.now().strftime("%Y%m%d%H%M%S")}.txt'
        file_path = os.path.join(media_path, filename)

        # write donation into file
        with open(file_path, "w") as file:
            file.write(f"Payment Method: {payment_method}\n")
            file.write(f"Amount: {amount}\n")
            file.write(f"Card Number: {card_number}\n")
            file.write(f"Expiry Date: {expiry_date}\n")
            file.write(f"Security Code (CVV): {cvv}\n")
            file.write(f"Cardholder Name: {cardholder_name}\n")

        # thinks
        return render(request, "customer/donation_success.html")

    return render(request, "customer/donate.html")
