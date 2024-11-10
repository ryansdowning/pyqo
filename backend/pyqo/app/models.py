from django.db import models

class Item(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey("auth.User", related_name="items", on_delete=models.CASCADE)
    code = models.UUIDField()

class Scan(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey("auth.User", related_name="scans", on_delete=models.CASCADE)
    item = models.ForeignKey(Item, related_name="scans", on_delete=models.CASCADE)
    location = models.CharField(max_length=255)

class Property(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey("auth.User", related_name="properties", on_delete=models.CASCADE)
    label = models.CharField(max_length=255)

class ItemProperty(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    item = models.ForeignKey(Item, related_name="properties", on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name="item_properties", on_delete=models.CASCADE)
    value = models.JSONField()