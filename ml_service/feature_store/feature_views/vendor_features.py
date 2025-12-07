"""
Vendor-centric feature view definitions.
"""

from datetime import timedelta

from feast import FeatureView, Field
from feast.types import Float32, Int64

from ..entities import vendor_entity
from ..sources import vendor_features_source

vendor_operations_view = FeatureView(
    name="vendor_operations_metrics",
    entities=[vendor_entity],
    ttl=timedelta(days=7),
    schema=[
        Field(name="gmv_7d", dtype=Float32),
        Field(name="net_revenue_7d", dtype=Float32),
        Field(name="refund_rate_30d", dtype=Float32),
        Field(name="on_time_fulfillment_rate", dtype=Float32),
        Field(name="churn_risk_score", dtype=Float32),
        Field(name="active_products", dtype=Int64),
    ],
    online=True,
    batch_source=vendor_features_source,
    tags={
        "owner": "data-ml",
        "source_model": "dbt.cohort_analysis",
        "domain": "vendor-intelligence",
    },
)


