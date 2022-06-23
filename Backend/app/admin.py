from django.contrib import admin
from .models import Vendor, Customer, Purchase, Sale

admin.site.register([Vendor, Customer, Purchase, Sale])
