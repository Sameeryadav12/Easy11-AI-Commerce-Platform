"""
User-centric feature view definitions.
"""

from datetime import timedelta

from feast import FeatureView, Field
from feast.types import Float32, Int64

from ..entities import user_entity
from ..sources import user_features_source

user_behavior_view = FeatureView(
    name="user_behavior_metrics",
    entities=[user_entity],
    ttl=timedelta(days=30),
    schema=[
        Field(name="orders_last_30d", dtype=Int64),
        Field(name="total_orders", dtype=Int64),
        Field(name="avg_order_value", dtype=Float32),
        Field(name="lifetime_value_score", dtype=Float32),
        Field(name="rfm_score", dtype=Float32),
    ],
    online=True,
    batch_source=user_features_source,
    tags={
        "owner": "data-ml",
        "source_model": "dbt.int_customer_rfm",
        "domain": "customer-intelligence",
    },
)


