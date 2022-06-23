from django.db import models


class Vendor(models.Model):
    name = models.CharField(max_length=50)
    status = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=50)
    status = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class Purchase(models.Model):
    quantity = models.FloatField()
    details = models.TextField()
    vendor = models.TextField()
    price = models.FloatField()
    total = models.FloatField()
    charges = models.FloatField(default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.vendor


class Sale(models.Model):
    purchase = models.ForeignKey(
        Purchase, on_delete=models.CASCADE, related_name='sales'
    )
    quantity = models.FloatField()
    details = models.TextField()
    customer = models.TextField()
    price = models.FloatField()
    total = models.FloatField()
    charges = models.FloatField(default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.purchase.vendor} -> {self.customer}"
