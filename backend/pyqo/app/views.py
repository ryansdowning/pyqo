from rest_framework import viewsets, permissions
from .models import Item, Scan, Property, ItemProperty
from .serializers import ItemSerializer, ScanSerializer, PropertySerializer, ItemPropertySerializer

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return items owned by the logged-in user
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
        # Only return scans owned by the logged-in user
        return Scan.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return properties owned by the logged-in user
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ItemPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = ItemPropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return item properties for items owned by the logged-in user
        return ItemProperty.objects.filter(item__owner=self.request.user)
