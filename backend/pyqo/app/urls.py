from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BulkCreateItemsView, ItemViewSet, ScanViewSet, PropertyViewSet, ItemPropertyViewSet, ScanItemView

router = DefaultRouter()

router.register(r'items', ItemViewSet, basename='item')
router.register(r'scans', ScanViewSet, basename='scan')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'item-properties', ItemPropertyViewSet, basename='itemproperty')

urlpatterns = [
    path('', include(router.urls)),
    path('items/<int:id>/scan/', ScanItemView.as_view(), name='scan-item'),
    path('bulk-create-items/', BulkCreateItemsView.as_view(), name='bulk-create-items'),
]
