from typing import TypedDict, Union
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Item, Scan, Property, ItemProperty

class DynamicPropertySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="property.id")
    label = serializers.CharField(source="property.label")
    value = serializers.JSONField()

    class Meta:
        model = ItemProperty
        fields = ['id', 'label', 'value']
    
class Position(TypedDict):
    latitude: float
    longitude: float

class ScanSerializer(serializers.ModelSerializer):
    position = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = ['id', 'created_at', 'owner', 'item', 'position', 'readable_location']

    @extend_schema_field({
        "type": "object",
        "nullable": True,
        "properties": {
            "latitude": {"type": "number", "format": "float"},
            "longitude": {"type": "number", "format": "float"},
        }
    })
    def get_position(self, obj) -> Union[Position, None]:
        if not obj.position:
            return None
        latitude, longitude = obj.position.latitude, obj.position.longitude

        return {'latitude': latitude, 'longitude': longitude}

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['label']

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
        fields = ['id', 'created_at', 'updated_at', 'owner', 'private', 'code', 'properties', 'latest_scan']

    @extend_schema_field(DynamicPropertySerializer(many=True))
    def get_properties(self, obj):
        all_properties = self.context.get('all_properties', False)
        if all_properties:
            return DynamicPropertySerializer(obj.properties.all(), many=True).data
        
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


class BulkCreateItemsRequestSerializer(serializers.Serializer):
    count = serializers.IntegerField(
        min_value=1,
        help_text="Number of items to create (must be a positive integer)."
    )
    private = serializers.BooleanField(
        required=False,
        default=False,
        help_text="Set the default value of the 'private' field for the created items."
    )

class BulkCreateItemsResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
