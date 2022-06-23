from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Vendor Roots
    path('api/vendor/', views.VendorAPI.as_view()),
    path('api/vendor/<int:pk>/', views.VendorAPI.as_view()),
    # Customer Roots
    path('api/customer/', views.CustomerAPI.as_view()),
    path('api/customer/<int:pk>/', views.CustomerAPI.as_view()),
    # Entry Roots
    path('api/entry/list/', views.EntryAPIListView.as_view()),  # Read
    path('api/entry/', views.EntryAPI.as_view()),               # Create,Update   
    path('api/entry/<int:pk>/', views.EntryAPI.as_view())       # Delete
]
