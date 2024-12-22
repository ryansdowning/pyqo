from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from .models import Item, Scan, Property, ItemProperty
from .serializers import ItemSerializer, ScanSerializer, PropertySerializer, ItemPropertySerializer, ViewItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Item, Scan
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['property_labels'] = self.request.query_params.getlist('property_labels')
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ScanViewSet(viewsets.ModelViewSet):
    serializer_class = ScanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Scan.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ItemPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = ItemPropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ItemProperty.objects.filter(item__owner=self.request.user)


class ViewItemView(APIView):
    serializer_class = ViewItemSerializer

    def get(self, request, id):
        item = get_object_or_404(Item, id=id)

        latitude = request.query_params.get("latitude", None)
        longitude = request.query_params.get("longitude", None)

        if not latitude or not longitude:
            return Response(
                {"error": "Latitude and longitude are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        Scan.objects.create(
            owner=request.user if request.user.is_authenticated else None,
            item=item,
            position=f"{latitude},{longitude}",
        )

        response_data = {"success": True}
        serializer = ViewItemSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)