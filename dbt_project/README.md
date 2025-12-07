# Easy11 dbt Project

ETL/ELT transformations for the analytics warehouse.

## Project Structure

```
dbt_project/
├── models/
│   ├── staging/          # Raw data cleanup
│   ├── intermediate/     # Reusable transformations
│   └── marts/
│       ├── core/         # Dimensional models
│       └── analytics/    # Business metrics
├── macros/               # Reusable SQL
├── tests/                # Data quality tests
├── dbt_project.yml       # Configuration
├── profiles.yml          # Connection config
└── schema.yml            # Schema docs
```

## Models

### Staging Models
- `stg_orders.sql` - Clean orders data
- `stg_products.sql` - Clean products data
- `stg_users.sql` - Clean users data
- `stg_order_items.sql` - Clean order items data

### Intermediate Models
- `int_order_revenue.sql` - Order revenue calculations
- `int_customer_rfm.sql` - RFM segmentation

### Core Marts
- `fact_orders.sql` - Order fact table
- `dim_products.sql` - Product dimension
- `dim_customers.sql` - Customer dimension

### Analytics Marts
- `daily_revenue.sql` - Daily revenue metrics
- `product_performance.sql` - Product sales analysis
- `cohort_analysis.sql` - Customer cohort analysis

## Getting Started

```bash
# Install dbt
pip install dbt-postgres

# Run transformations
dbt run

# Run tests
dbt test

# Generate docs
dbt docs generate
dbt docs serve
```

## Key Features

- **RFM Segmentation**: Customer value analysis
- **Cohort Analysis**: Customer retention tracking
- **Product Performance**: Sales analytics
- **Daily Metrics**: Revenue and order KPIs
