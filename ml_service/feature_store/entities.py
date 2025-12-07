"""
Feast entity definitions for Easy11 feature store.
Entities represent the primary keys used to join offline and online data.
"""

from feast import Entity

user_entity = Entity(
    name="user",
    join_keys=["user_id"],
    description="Customer accounts interacting with Easy11 platforms.",
    tags={"domain": "customer"},
)

product_entity = Entity(
    name="product",
    join_keys=["product_id"],
    description="Catalog products sold on Easy11.",
    tags={"domain": "catalog"},
)

vendor_entity = Entity(
    name="vendor",
    join_keys=["vendor_id"],
    description="Marketplace vendors managing inventory and orders.",
    tags={"domain": "vendor"},
)

__all__ = ["user_entity", "product_entity", "vendor_entity"]

