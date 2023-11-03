from django.urls import path,include
from .views import *

urlpatterns = [
    path('', index, name="index"),
    path('daraja/stk_push', stk_push_callback, name="stk_push_callback"),
]