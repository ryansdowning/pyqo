from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Item, Scan, Property, ItemProperty
from drf_spectacular.utils import extend_schema
from .serializers import BulkCreateItemsRequestSerializer, BulkCreateItemsResponseSerializer, ItemSerializer, PropertyCreateSerializer, ScanSerializer, PropertySerializer, ItemPropertySerializer, ViewItemSerializer

from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Item, Scan
from .serializers import ItemSerializer
from django.contrib.gis.geoip2 import GeoIP2
from geopy.geocoders import Nominatim

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Unauthenticated users cannot list items.")
        return Item.objects.filter(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """
        Allow unauthenticated access to individual items if `item.private` is False.
        """
        instance = self.get_object()
        if not request.user.is_authenticated and instance.private:
            raise PermissionDenied("You do not have permission to access this item.")
        return super().retrieve(request, *args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['all_properties'] = self.request.query_params.get('all_properties', False) == 'true'
        context['property_labels'] = self.request.query_params.getlist('property_labels')
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ScanViewSet(viewsets.ModelViewSet):
    serializer_class = ScanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['item']

    def get_queryset(self):
        return Scan.objects.filter(item__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':  # Use the custom serializer for POST
            return PropertyCreateSerializer
        return super().get_serializer_class()
    
    @extend_schema(
        request=PropertyCreateSerializer,
        responses=PropertySerializer
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ItemPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = ItemPropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ItemProperty.objects.filter(item__owner=self.request.user)


class ScanItemView(APIView):
    authentication_classes = []
    serializer_class = ViewItemSerializer

    def post(self, request, id):
        item = get_object_or_404(Item, id=id)

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        if latitude and longitude:
            try:
                geolocator = Nominatim(user_agent="pyqo")
                location = geolocator.reverse((latitude, longitude), timeout=10)
                address = location.raw["address"]
                city = address.get("city") or address.get("town") or address.get("village")
                country_code = address.get("country_code", "").upper()
                readable_location = f"{city}, {country_code}"
                print(readable_location)
            except:
                readable_location = None
        else:
            try:
                result = GeoIP2().city(ip)
                latitude = result['latitude']
                longitude = result['longitude']
                readable_location = f"{result['city']}, {result['country_code']}"
            except Exception:
                Scan.objects.create(
                    owner=request.user if request.user.is_authenticated else None,
                    item=item,
                )
                return Response(ViewItemSerializer({"success": True}).data, status=status.HTTP_200_OK)

        Scan.objects.create(
            owner=request.user if request.user.is_authenticated else None,
            item=item,
            position=f"{latitude},{longitude}",
            readable_location=readable_location,
        )

        response_data = {"success": True}
        serializer = ViewItemSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class BulkCreateItemsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=BulkCreateItemsRequestSerializer,
        responses=BulkCreateItemsResponseSerializer,
    )
    def post(self, request, *args, **kwargs):
        serializer = BulkCreateItemsRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        count = serializer.validated_data['count']
        private = serializer.validated_data.get('private', False)

        items = [Item(owner=request.user, private=private) for _ in range(count)]
        Item.objects.bulk_create(items)

        response_data = {
            "message": f"Successfully created {count} items."
        }
        return Response(response_data, status=status.HTTP_201_CREATED)