from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from .models import Item, Scan, Property, ItemProperty
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .serializers import ItemSerializer, ScanSerializer, PropertySerializer, ItemPropertySerializer, ViewItemSerializer

from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Item, Scan
from .serializers import ItemSerializer
from django.contrib.gis.geoip2 import GeoIP2

@extend_schema(parameters=[
    OpenApiParameter(
            name='id',
            required=True,
            location=OpenApiParameter.PATH,
            type=int
        )
])
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


@extend_schema(parameters=[
    OpenApiParameter(
            name='id',
            required=True,
            location=OpenApiParameter.PATH,
            type=int
        )
])
class ScanViewSet(viewsets.ModelViewSet):
    serializer_class = ScanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Scan.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@extend_schema(parameters=[
    OpenApiParameter(
            name='id',
            required=True,
            location=OpenApiParameter.PATH,
            type=int
        )
])
class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@extend_schema(parameters=[
    OpenApiParameter(
            name='id',
            required=True,
            location=OpenApiParameter.PATH,
            type=int
        )
])
class ItemPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = ItemPropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ItemProperty.objects.filter(item__owner=self.request.user)


class ViewItemView(APIView):
    serializer_class = ViewItemSerializer

    def post(self, request, id):
        item = get_object_or_404(Item, id=id)

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        try:
            latitude, longitude = GeoIP2().lat_lon(ip)
        except Exception as e:
            return Response(ViewItemSerializer({"success": False}).data, status=status.HTTP_200_OK)

        Scan.objects.create(
            owner=request.user if request.user.is_authenticated else None,
            item=item,
            position=f"{latitude},{longitude}",
        )

        response_data = {"success": True}
        serializer = ViewItemSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)