from django.urls import path
from  . import views

urlpatterns = [
    path('',views.getData),
    path('objects/', views.getObject),
    path('customer/', views.addCustomer),
    path('check-user/',  views.checkCustomer),
    path('verify-pin/',  views.verifyPin),
]