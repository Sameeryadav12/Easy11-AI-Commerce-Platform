"""
Feast feature store package for Easy11.
"""

from .entities import user_entity, product_entity, vendor_entity
from .feature_views import (
    user_behavior_view,
    product_performance_view,
    vendor_operations_view,
)

__all__ = [
    "user_entity",
    "product_entity",
    "vendor_entity",
    "user_behavior_view",
    "product_performance_view",
    "vendor_operations_view",
]

