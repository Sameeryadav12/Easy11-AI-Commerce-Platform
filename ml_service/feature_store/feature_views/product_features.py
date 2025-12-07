"""
Product-centric feature view definitions.
"""

from datetime import timedelta

from feast import FeatureView, Field
from feast.types import Float32, Int64

from ..entities import product_entity
from ..sources import product_features_source

product_performance_view = FeatureView(
    name="product_performance_metrics",
    entities=[product_entity],
    ttl=timedelta(days=14),
    schema=[
        Field(name="views_7d", dtype=Int64),
        Field(name="add_to_cart_7d", dtype=Int64),
        Field(name="orders_7d", dtype=Int64),
        Field(name="conversion_rate", dtype=Float32),
        Field(name="return_rate", dtype=Float32),
        Field(name="stock_velocity", dtype=Float32),
    ],
    online=True,
    batch_source=product_features_source,
    tags={
        "owner": "data-ml",
        "source_model": "dbt.product_performance",
        "domain": "catalog-intelligence",
    },
)


