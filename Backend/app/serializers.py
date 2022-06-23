from rest_framework import serializers
from json import loads, dumps
from .models import Purchase, Sale, Vendor, Customer


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ["id", "name", "status"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "status"]


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

    def to_representation(self, instance):
        instance = super().to_representation(instance)
        instance['vendor'] = loads(instance['vendor'])
        return instance


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

    def to_representation(self, instance):
        instance = super().to_representation(instance)
        instance['customer'] = loads(instance['customer'])
        return instance


class EntrySerializer(serializers.ModelSerializer):
    sales = SaleSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = '__all__'

    def to_representation(self, instance):
        instance = super().to_representation(instance)
        instance['vendor'] = loads(instance['vendor'])
        return instance
