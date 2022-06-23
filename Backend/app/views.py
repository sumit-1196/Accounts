from .models import Purchase, Vendor, Customer, Sale
from .serializers import EntrySerializer, VendorSerializer, CustomerSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters import FilterSet
from django_filters.rest_framework import DjangoFilterBackend
from json import dumps
import time

successStatus = {"status": True}

failedStatus = {"status": False}


class VendorAPI(APIView):
    def get(self, request, pk=None, format=None):
        try:
            if pk is not None:
                vendor = Vendor.objects.get(id=pk)
                serializer = VendorSerializer(vendor)
                return Response(serializer.data)

            if request.GET.get('name'):
                vendor = Vendor.objects.filter(
                    name__contains=request.GET.get('name')
                )
                serializer = VendorSerializer(vendor, many=True)
                return Response(serializer.data)

            vendor = Vendor.objects.all()
            serializer = VendorSerializer(vendor, many=True)
            return Response(serializer.data)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        try:
            serializer = VendorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(successStatus, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None, format=None):
        try:
            vendor = Vendor.objects.get(id=pk)
            serializer = VendorSerializer(vendor, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(successStatus)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        try:
            Vendor.objects.get(id=pk).delete()
            return Response(successStatus, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)


class CustomerAPI(APIView):
    def get(self, request, pk=None, format=None):
        try:
            if pk is not None:
                customer = Customer.objects.get(id=pk)
                serializer = CustomerSerializer(customer)
                return Response(serializer.data)

            if request.GET.get('name'):
                customer = Customer.objects.filter(
                    name__contains=request.GET.get('name')
                )
                serializer = CustomerSerializer(customer, many=True)
                return Response(serializer.data)

            customer = Customer.objects.all()
            serializer = CustomerSerializer(customer, many=True)
            return Response(serializer.data)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        try:
            serializer = CustomerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(successStatus, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None, format=None):
        try:
            customer = Customer.objects.get(id=pk)
            serializer = CustomerSerializer(customer, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(successStatus)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        try:
            Customer.objects.get(id=pk).delete()
            return Response(successStatus, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)




class EntryAPIListView(ListAPIView):
    queryset = Purchase.objects.all()
    serializer_class = EntrySerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['created_at']
    # search_fields = ['quantity', 'price', 'details', 'vendor',
    #                  'sales__quantity', 'sales__price', 'sales__details', 'sales__customer']


class EntryAPI(APIView):
    def post(self, request, format=None):
        try:
            data = request.data
            sales = data.get('sales')
            del data['sales']
            data['vendor'] = dumps(data['vendor'])

            purchase = Purchase(**data)
            purchase.save()

            for sale in range(len(sales)):
                sales[sale]['purchase'] = purchase
                sales[sale]['customer'] = dumps(sales[sale]['customer'])
                sales[sale] = Sale(**sales[sale])

            Sale.objects.bulk_create(sales)
            return Response(successStatus, status=status.HTTP_201_CREATED)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        try:
            data = request.data
            pur = Purchase.objects.get(id=data.get('id'))
            pur.quantity = data.get('quantity')
            pur.details = data.get('details')
            pur.vendor = dumps(data.get('vendor'))
            pur.price = data.get('price')
            pur.total = data.get('total')
            pur.save()

            sales = data.get('sales')
            for item in sales:
                sale = Sale.objects.get(id=item.get('id'))
                sale.quantity = item.get('quantity')
                sale.details = item.get('details')
                sale.customer = dumps(item.get('customer'))
                sale.price = item.get('price')
                sale.total = item.get('total')
                sale.save()
            return Response(successStatus)
        except:
            return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        # try:
        Purchase.objects.get(id=pk).delete()
        return Response(successStatus, status=status.HTTP_204_NO_CONTENT)
        # except:
        #     return Response(failedStatus, status=status.HTTP_400_BAD_REQUEST)
