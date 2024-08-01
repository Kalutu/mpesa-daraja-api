from django.shortcuts import render
from django.http import HttpResponse
from django_daraja.mpesa.core import MpesaClient
from .forms import PaymentForm

def index(request):
    if request.method == 'POST':
        form = PaymentForm(request.POST)
        if form.is_valid():
            payment = form.save()
            cl = MpesaClient()
            phone_number = payment.phone_number
            amount = payment.amount
            account_reference = 'reference'
            transaction_desc = 'Description'
            callback_url = 'https://tender254.com/'
            response = cl.stk_push(phone_number, amount, account_reference, transaction_desc, callback_url)
            return HttpResponse(response)
    else:
        form = PaymentForm()

    return render(request, 'index.html', {'form': form})