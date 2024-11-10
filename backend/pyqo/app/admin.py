from django.contrib import admin

from app.models import Item, Scan, Property, ItemProperty

admin.site.register(Item)
admin.site.register(Scan)
admin.site.register(Property)
admin.site.register(ItemProperty)
