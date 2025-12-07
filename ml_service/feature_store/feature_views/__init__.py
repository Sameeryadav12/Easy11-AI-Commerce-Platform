"""
Expose Feast feature views for Easy11.
Import feature view modules here so `feast apply` discovers them.
"""

from .user_features import user_behavior_view
from .product_features import product_performance_view
from .vendor_features import vendor_operations_view

__all__ = [
    "user_behavior_view",
    "product_performance_view",
    "vendor_operations_view",
]

