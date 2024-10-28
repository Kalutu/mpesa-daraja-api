from django.urls import path
from . import views

urlpatterns = [
    path('', views.payment_view, name='payment'),
    path('callback/', views.payment_callback, name='payment_callback'),
    path('stk-status/', views.stk_status_view, name='stk_status'),
]
