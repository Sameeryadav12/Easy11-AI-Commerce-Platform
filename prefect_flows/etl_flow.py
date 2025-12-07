"""
Prefect ETL Flow for Easy11
Daily data pipeline: Extract → Transform → Load
"""

import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

from prefect import flow, task
from prefect.tasks import task_input_hash


@task(
    retries=3,
    retry_delay_seconds=60,
    cache_key_fn=task_input_hash,
    cache_expiration=timedelta(hours=1)
)
def extract_oltp_data():
    """Extract data from OLTP PostgreSQL database"""
    print("📥 Extracting OLTP data...")
    # Simulate data extraction
    # In production: Use Airbyte, Singer, or custom extraction
    return {"status": "success", "records": 1000}


BASE_DIR = Path(__file__).resolve().parents[1]
FEATURE_STORE_DIR = BASE_DIR / "ml_service" / "feature_store"


@task
def validate_data_quality():
    """Validate data using Great Expectations"""
    print("✓ Validating data quality...")
    result = subprocess.run(
        ["great_expectations", "checkpoint", "run", "orders_checkpoint"],
        capture_output=True,
        text=True
    )
    return result.returncode == 0


@task
def transform_with_dbt():
    """Transform data using dbt"""
    print("🔄 Transforming data with dbt...")
    result = subprocess.run(
        ["dbt", "run", "--profiles-dir", "dbt_project"],
        capture_output=True,
        text=True
    )
    return result.returncode == 0


@task
def load_to_warehouse():
    """Load transformed data to analytics warehouse"""
    print("📤 Loading to warehouse...")
    # Data is already loaded via dbt
    return {"status": "success"}


@task
def generate_documentation():
    """Generate dbt documentation"""
    print("📝 Generating documentation...")
    result = subprocess.run(
        ["dbt", "docs", "generate", "--profiles-dir", "dbt_project"],
        capture_output=True,
        text=True
    )
    return result.returncode == 0


@task
def apply_feature_store_definitions():
    """Run feast apply to register feature definitions."""
    if not FEATURE_STORE_DIR.exists():
        raise FileNotFoundError("Feature store directory not found. Expected at ml_service/feature_store")

    print("📚 Applying Feast feature definitions...")
    result = subprocess.run(
        ["feast", "apply"],
        cwd=str(FEATURE_STORE_DIR),
        capture_output=True,
        text=True,
        env={**os.environ, "PYTHONPATH": str(BASE_DIR)},
    )
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        raise ValueError("Feast apply failed. See logs above.")
    print("✅ Feast definitions applied.")


@task
def materialize_feature_store():
    """Materialize latest features into the online store using Feast."""
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    print(f"⚙️ Materializing Feast feature store up to {timestamp}...")
    result = subprocess.run(
        ["feast", "materialize-incremental", timestamp],
        cwd=str(FEATURE_STORE_DIR),
        capture_output=True,
        text=True,
        env={**os.environ, "PYTHONPATH": str(BASE_DIR)},
    )
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        raise ValueError("Feast materialize failed. Ensure warehouse connectivity and data freshness.")
    print("✅ Feast materialization complete.")


@flow(name="easy11_daily_etl", log_prints=True)
def daily_etl_flow():
    """
    Main ETL flow orchestrator
    
    Flow:
    1. Extract OLTP data
    2. Validate data quality
    3. Transform with dbt
    4. Load to warehouse
    5. Apply Feast definitions & materialize features
    6. Generate documentation
    """
    print("🚀 Starting Easy11 Daily ETL Pipeline...")
    
    # Extract
    extract_result = extract_oltp_data()
    print(f"Extracted {extract_result['records']} records")
    
    # Validate
    if not validate_data_quality():
        raise ValueError("Data quality validation failed")
    
    # Transform
    if not transform_with_dbt():
        raise ValueError("dbt transformation failed")
    
    # Load
    load_result = load_to_warehouse()
    print(f"Loaded to warehouse: {load_result['status']}")
    
    # Register Feast definitions & materialize online store
    apply_feature_store_definitions()
    materialize_feature_store()

    # Generate docs
    generate_documentation()
    
    print("✅ ETL Pipeline completed successfully!")


if __name__ == "__main__":
    # Run the flow
    daily_etl_flow()

