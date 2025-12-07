"""
Feast offline data sources backed by dbt models or parquet exports.
Update the paths/schema once the analytics warehouse structure is finalized.
"""

from datetime import timedelta

from feast import FileSource

USER_FEATURES_PATH = "data/user_behavior_features.parquet"
PRODUCT_FEATURES_PATH = "data/product_performance_features.parquet"
VENDOR_FEATURES_PATH = "data/vendor_operations_features.parquet"

common_kwargs = {
    "timestamp_field": "event_timestamp",
    "created_timestamp_column": "created_at",
}

user_features_source = FileSource(
    path=USER_FEATURES_PATH,
    description="User behavior metrics derived from dbt.int_customer_rfm",
    **common_kwargs,
)

product_features_source = FileSource(
    path=PRODUCT_FEATURES_PATH,
    description="Product performance metrics from dbt.product_performance",
    **common_kwargs,
)

vendor_features_source = FileSource(
    path=VENDOR_FEATURES_PATH,
    description="Vendor operations metrics from dbt.cohort_analysis and vendor marts",
    **common_kwargs,
)

__all__ = [
    "user_features_source",
    "product_features_source",
    "vendor_features_source",
    "USER_FEATURES_PATH",
    "PRODUCT_FEATURES_PATH",
    "VENDOR_FEATURES_PATH",
]

