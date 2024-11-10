from rest_framework import serializers
from .models import Item, Scan, Property, ItemProperty

class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    scans = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    properties = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'created_at', 'updated_at', 'owner', 'code', 'scans', 'properties']


class ScanSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = Scan
        fields = ['id', 'created_at', 'owner', 'item', 'location']


class PropertySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    item_properties = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'created_at', 'updated_at', 'owner', 'label', 'item_properties']


class ItemPropertySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    class Meta:
        model = ItemProperty
        fields = ['id', 'created_at', 'updated_at', 'item', 'property', 'value']
