from django.conf import settings
from visualization.settings import TEMPLATE_PATHS
from django.shortcuts import render, redirect
from django.contrib import messages
import os
from django.utils import timezone
#测试
# view for home page inlcuding the navigator
def home(request):
    username = request.session.get("username", "guest")
    return render(request, TEMPLATE_PATHS["home"], {"username": username})


# view for introduction iframe page
def introduction(request):
    return render(request, TEMPLATE_PATHS["introduction"], {"data": "introduction"})


# view for models iframe page
def models(request):
    return render(
        request,
        TEMPLATE_PATHS["models"],
        {"data": "models", "media_test": settings.MEDIA_URL + "test1.png"},
    )


# view for workspace iframe page
def workspace(request):
    return render(request, TEMPLATE_PATHS["workspace"], {"data": "workspace"})



# view for fo to customer login page
def login_customer(request):
    return render(request, TEMPLATE_PATHS["login-customer"], {"data": "login_customer"})


# view for fo to customer register page
def register_customer(request):
    return render(request, TEMPLATE_PATHS["register"], {"data": "register"})


def contact_us(request):
    if request.method == "POST":
        # 获取用户输入
        name = request.POST.get("name", "Anonymous").strip() or "Anonymous"
        email = request.POST.get("email", "No email provided").strip() or "No email provided"
        message = request.POST.get("message", "").strip()

        if not message:
            messages.error(request, "Message cannot be empty.")
            return redirect("contact_us")

        # 确保 media 目录存在
        media_path = os.path.join("media", "contact_messages")
        os.makedirs(media_path, exist_ok=True)

        # 生成文件名，使用时间戳防止重复
        from datetime import datetime
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        file_path = os.path.join(media_path, filename)

        # 将留言写入文件
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Message:\n{message}\n")

        messages.success(request, "Your message has been saved successfully!")
        return redirect("contact_us")

    return render(request, "customer/contact_us.html")


def about_us(request):
    return render(request, 'customer/about_us.html')

def support_us(request):
    return render(request, 'customer/support_us.html')

def support(request):
    return render(request, 'customer/support.html')
def donate(request):
    return render(request, "customer/donate.html")
def donate(request):
    if request.method == 'POST':
        payment_method = request.POST.get('payment_method')
        amount = request.POST.get('amount')
        card_number = request.POST.get('card_number')
        expiry_date = request.POST.get('expiry_date')
        cvv = request.POST.get('cvv')
        cardholder_name = request.POST.get('cardholder_name')

        # 创建保存路径
        media_path = settings.MEDIA_ROOT
        if not os.path.exists(media_path):
            os.makedirs(media_path)

        # 文件名使用时间戳，避免重复
        filename = f'donation_{timezone.now().strftime("%Y%m%d%H%M%S")}.txt'
        file_path = os.path.join(media_path, filename)

        # 将数据写入文件
        with open(file_path, 'w') as file:
            file.write(f'Payment Method: {payment_method}\n')
            file.write(f'Amount: {amount}\n')
            file.write(f'Card Number: {card_number}\n')
            file.write(f'Expiry Date: {expiry_date}\n')
            file.write(f'Security Code (CVV): {cvv}\n')
            file.write(f'Cardholder Name: {cardholder_name}\n')

        # 提交完成后跳转到感谢页面
        return render(request, "customer/donation_success.html")

    return render(request, "customer/donate.html")

