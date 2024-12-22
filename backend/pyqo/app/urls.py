from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ScanViewSet, PropertyViewSet, ItemPropertyViewSet, ViewItemView

router = DefaultRouter()

router.register(r'items', ItemViewSet, basename='item')
router.register(r'scans', ScanViewSet, basename='scan')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'item-properties', ItemPropertyViewSet, basename='itemproperty')

# Define the urlpatterns
urlpatterns = [
    path('', include(router.urls)),
    path('items/<int:id>/view/', ViewItemView.as_view(), name='view-item')
]
