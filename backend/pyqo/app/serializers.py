from rest_framework import serializers
from .models import Item, Scan, Property, ItemProperty

class DynamicPropertySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="property.label")
    value = serializers.JSONField()

    class Meta:
        model = ItemProperty
        fields = ['label', 'value']

class ItemSerializer(serializers.ModelSerializer):
    properties = serializers.SerializerMethodField()
    latest_scan = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'created_at', 'updated_at', 'owner', 'code', 'properties', 'latest_scan']

    def get_properties(self, obj):
        # Retrieve property_labels from context if available; otherwise, default to None
        property_labels = self.context.get('property_labels', None)

        # If property_labels is None or empty, return an empty list
        if not property_labels:
            return []

        # Otherwise, filter ItemProperty instances based on the provided property labels
        item_properties = ItemProperty.objects.filter(
            item=obj,
            item__owner=obj.owner,
            property__label__in=property_labels
        ).select_related('property')

        # Serialize the filtered properties
        return DynamicPropertySerializer(item_properties, many=True).data

    def get_latest_scan(self, obj):
        latest_scan = obj.scans.order_by('-created_at').first()
        if latest_scan:
            return ScanSerializer(latest_scan).data
        return None

class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = "__all__"

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = "__all__"


class ItemPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemProperty
        fields = "__all__"
