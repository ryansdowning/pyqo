from typing import TypedDict
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Item, Scan, Property, ItemProperty

class DynamicPropertySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="property.label")
    value = serializers.JSONField()

    class Meta:
        model = ItemProperty
        fields = ['label', 'value']
    
class Position(TypedDict):
    latitude: float
    longitude: float

class ScanSerializer(serializers.ModelSerializer):
    position = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = ['id', 'created_at', 'owner', 'item', 'position']

    def get_position(self, obj) -> Position :
        latitude, longitude = obj.position.latitude, obj.position.longitude
        return {'latitude': latitude, 'longitude': longitude}

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"


class ItemPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemProperty
        fields = "__all__"


class ViewItemSerializer(serializers.Serializer):
    success = serializers.BooleanField()



class ItemSerializer(serializers.ModelSerializer):
    properties = serializers.SerializerMethodField()
    latest_scan = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'created_at', 'updated_at', 'owner', 'code', 'properties', 'latest_scan']

    @extend_schema_field(DynamicPropertySerializer(many=True))
    def get_properties(self, obj):
        property_labels = self.context.get('property_labels', None)

        if not property_labels:
            return []

        item_properties = ItemProperty.objects.filter(
            item=obj,
            item__owner=obj.owner,
            property__label__in=property_labels
        ).select_related('property')

        return DynamicPropertySerializer(item_properties, many=True).data

    @extend_schema_field(ScanSerializer)
    def get_latest_scan(self, obj):
        latest_scan = obj.scans.order_by('-created_at').first()
        if latest_scan:
            return ScanSerializer(latest_scan).data
        return None