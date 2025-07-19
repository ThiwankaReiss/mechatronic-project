from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from base.models import Customer
from .serializers import CustomerSerializer

import requests
import random
import string
import time
import subprocess
from  . import main

@api_view(['GET'])
def getData(request):
    person = {'name': 'Denis', 'age': 28}
    return Response(person)

@csrf_exempt
@api_view(['POST'])
def getObject(request):
    obj = request.data.get('object_id')
    location = request.data.get('location')
    
    if not obj or not location:
        return Response({'error': 'Missing object_id or location'}, status=status.HTTP_400_BAD_REQUEST)

    # Capitalize appropriately: red_circle -> Red_Circle
    formatted_obj = "_".join([x.capitalize() for x in obj.split("_")])
    print(formatted_obj )
    try:
        # Run Python main module and pass args (can be via subprocess or import)
        
        main.main(formatted_obj, location)
        print("hello")
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    return Response({
        'message': 'Object handled successfully',
        'object_id': obj,
        'location': location
    }, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['POST'])
def addCustomer(request):
    name = request.data.get('name')
    phone = request.data.get('phoneNo')

    if isUserPresent(name, phone):
        return Response({'message': 'User already registered'}, status=409)

    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        sms_success = send_sms_notifylk(phone, "You have been registered successfully!")
        if sms_success:
            serializer.save()
            return Response({'message': 'Registered successfully'}, status=201)
        else:
            return Response({'message': 'Phone number invalid or SMS failed'}, status=400)

    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(['POST'])
def checkCustomer(request):
    name = request.data.get('name')
    is_present = Customer.objects.filter(name=name).exists()

    if is_present:
        pin = generate_pin()
        customer = Customer.objects.get(name=name)
        customer.pin = pin
        customer.save()
        sms_message = f"Your verification PIN is: {pin}"
        success = send_sms_notifylk(customer.phoneNo, sms_message)
        return Response('user available')
    else:
        return Response('invalid user')

@csrf_exempt
@api_view(['POST'])
def verifyPin(request):
    name = request.data.get('name')
    pin_typed = request.data.get('pin')

    try:
        customer = Customer.objects.get(name=name)
    except Customer.DoesNotExist:
        return Response({'message': 'Invalid user'}, status=404)

    if customer.pin == pin_typed:
        return Response({'message': 'valid pin'})
    else:
        return Response({'message': 'invalid pin'}, status=400)

def calledMethod():
    print("hi")

def send_sms_notifylk(phone, message_text):
    user_id = "29794"
    api_key = "u9d8ygOhd5lJthTvJ5O0"
    sender_id = "NotifyDEMO"
    to = phone

    url = "https://app.notify.lk/api/v1/send"
    payload = {
        "user_id": user_id,
        "api_key": api_key,
        "sender_id": sender_id,
        "to": to,
        "message": message_text
    }

    try:
        response = requests.post(url, data=payload)
        response.raise_for_status()
        result = response.json()
        return result.get("status") == "success"
    except requests.exceptions.RequestException as e:
        print(" Error sending SMS via Notify.lk:", str(e))
        return False

def isUserPresent(name, phone):
    return (
        Customer.objects.filter(name=name).exists() or
        Customer.objects.filter(phoneNo=phone).exists()
    )

def generate_pin():
    pin = random.randint(0, 9999)
    # Convert to a zero-padded 4-digit string (e.g., '0047', '1234')
    return f"{pin:04d}"
 
