# 🏢 Easy11 Admin Portal - Complete User Guide

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Target Audience**: Admins, Analysts, Ops, Support

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigation & Interface](#navigation--interface)
3. [Module Guide](#module-guide)
4. [Role-Based Access](#role-based-access)
5. [Data Export Guide](#data-export-guide)
6. [Best Practices](#best-practices)

---

## Getting Started

### Accessing the Admin Portal

**URL**: https://admin.easy11.app  
**Authentication**: SSO/OIDC via Keycloak

### First Login

1. Navigate to `https://admin.easy11.app`
2. Click "Sign in with SSO"
3. Enter your corporate credentials
4. Complete MFA challenge (if ADMIN role)
5. You'll land on the Overview dashboard

### Roles & Permissions

| Role | Access Level | Primary Use Case |
|------|-------------|------------------|
| **ADMIN** | Full access | System administrators, founders |
| **ANALYST** | Read analytics, export | Data analysts, BI team |
| **OPS** | Catalog management | Operations, inventory managers |
| **SUPPORT** | View customers/orders | Customer support team |

---

## Navigation & Interface

### Sidebar Navigation

```
📊 Overview          - KPIs and metrics
👥 Customers         - RFM segments, churn
📦 Catalog           - Product management
📈 Forecasts         - Demand predictions
🤖 Recommendations   - ML model ops
🧪 Experiments       - A/B testing
✅ Data Quality      - Data validation
📉 Dashboards        - BI visualizations
⚙️  Settings         - Configuration
```

### Header

- **Search**: Global search across all modules
- **Notifications**: System alerts and updates
- **User Menu**: Profile, settings, logout

---

## Module Guide

### 1. Overview Dashboard

**Access**: All roles  
**Purpose**: Monitor key business metrics

#### KPI Cards

**Revenue**
- Total revenue for selected period
- Period-over-period change %
- Target: Track daily/weekly trends

**Orders**
- Total orders count
- Average order value
- Conversion rate

**Customers**
- Active customers count
- New vs returning
- Customer lifetime value

**Conversion Rate**
- Percentage of visitors who purchase
- Trend indicator
- Funnel drop-off points

#### Time Filters
- Last 7 days
- Last 30 days
- Last 90 days
- Custom date range

#### Quick Actions
- Export metrics to CSV
- Schedule email reports
- Set alert thresholds

---

### 2. Customers & Churn

**Access**: ADMIN, ANALYST  
**Purpose**: Customer intelligence and retention

#### RFM Segmentation

**Segments**:
1. **Champions** (R:5, F:5, M:5) - Best customers
2. **Loyal Customers** (R:2-5, F:4-5, M:4-5) - Regular buyers
3. **Potential Loyalists** (R:3-5, F:1-2, M:3-5) - Recent high-value
4. **New Customers** (R:4-5, F:1, M:1-2) - First purchase
5. **At Risk** (R:1-2, F:3-5, M:3-5) - Losing them
6. **Cannot Lose Them** (R:1-2, F:1-2, M:5) - High value, inactive
7. **Lost** (R:1-2, F:1-2, M:1-2) - Churned

#### Churn Risk Heatmap
- Visual representation of churn risk by segment
- Click to drill down to customer list
- Export high-risk customers

#### Individual Customer View
- Complete purchase history
- RFM scores breakdown
- Churn probability
- Recommended actions

#### Export Options
- **CSV Export**: Customer list with churn scores
- **Includes**: User ID, email (hashed), segment, churn prob, top 3 reasons
- **Watermark**: Exported by [user] on [date]

---

### 3. Catalog & Inventory

**Access**: ADMIN, OPS  
**Purpose**: Product and category management

#### Product Management

**Features**:
- Search and filter products
- Edit product details
- Update inventory levels
- Set pricing and discounts
- Manage product images

**Bulk Operations**:
- Import products from CSV
- Export catalog to CSV
- Bulk price updates
- Inventory adjustments

#### Category Tree

**Features**:
- Hierarchical category browser
- Drag-and-drop reordering
- Add/edit/delete categories
- Product count per category

**Performance**:
- Supports 5,000+ nodes
- Uses materialized path for O(log n) queries
- Fast expand/collapse

#### Audit Trail
- All changes tracked
- Who, what, when
- Before/after snapshots
- Rollback capability

---

### 4. Experiments (A/B Testing)

**Access**: ADMIN, ANALYST  
**Purpose**: Feature testing and optimization

#### Creating Experiments

**Steps**:
1. Click "+ New Experiment"
2. Define experiment name and description
3. Set up variants (A/B or A/B/C/...)
4. Configure allocation (50/50 or custom)
5. Set success metric (conversion, revenue, etc.)
6. Define audience (all users or segment)
7. Set start/end dates
8. Add guardrail metrics

#### Running Experiments

**Status Flow**:
```
Draft → Running → Completed → Archived
```

**Monitoring**:
- Real-time variant performance
- Conversion rates
- Statistical significance
- Confidence intervals
- Uplift calculation

#### Statistical Analysis

**Metrics Calculated**:
- **Uplift**: % improvement over control
- **p-value**: Statistical significance
- **Confidence Interval**: 95% CI
- **Sample Size**: Power analysis

**Decision Criteria**:
- p-value < 0.05 (statistically significant)
- Confidence > 95%
- Minimum runtime: 2 weeks
- Minimum sample: 1,000 per variant

#### Export Reports

**Formats**:
- PDF report with charts
- CSV with raw data
- PowerPoint summary

**Includes**:
- Experiment configuration
- Statistical results
- Variant comparison
- Recommendations

---

### 5. Forecasts

**Access**: ADMIN, ANALYST  
**Purpose**: Demand prediction and inventory planning

#### Forecast Types

**Overall Demand**
- 30-day ahead predictions
- Confidence intervals
- Trend and seasonality

**Category Forecasts**
- By product category
- Daily/weekly granularity
- Stock recommendations

**Product-Level**
- Individual SKU predictions
- Reorder alerts
- Promotion planning

#### Accuracy Metrics

**Displayed Metrics**:
- **sMAPE**: Symmetric Mean Absolute Percentage Error (Target: <15%)
- **RMSE**: Root Mean Square Error
- **MAPE**: Mean Absolute Percentage Error

**Comparison**:
- Last 7 days: Forecast vs Actuals
- Accuracy by category
- Model performance trends

#### Actions

**Manual Refresh**:
- Trigger forecast regeneration
- Specify horizon (7, 14, 30 days)
- Select categories

**Export**:
- Download forecasts as CSV
- Include confidence intervals
- Add notes for planning

---

### 6. Recommendations (ML Ops)

**Access**: ADMIN only  
**Purpose**: ML model monitoring and control

#### Production Model Status

**Metrics Displayed**:
- **HitRate@10**: 0.24 (Target: >0.20) ✅
- **Precision@5**: 0.45
- **Recall@10**: 0.38
- **Coverage**: 0.78
- **Diversity**: 0.62

**Performance**:
- **Latency (p95)**: 135ms (Target: <150ms) ✅
- **Cache Hit Rate**: 72% (Target: >70%) ✅
- **Throughput**: 1,200 req/min

#### Model Lifecycle

**Version Management**:
```
Candidate → Testing → Promotion → Production → Archived
```

**Promotion Criteria**:
- HitRate@10 better than current
- Latency within SLO
- A/B test shows positive uplift
- Approved by ADMIN

**Promote Button**:
1. Click "Promote to Production"
2. Confirm action (requires re-auth)
3. Model alias updates in MLflow
4. Cache invalidated
5. Changes reflected in < 60s
6. Audit log created

**Rollback Button**:
1. Select previous version
2. Click "Rollback"
3. Confirm with reason
4. Immediate rollback
5. Notification sent

#### Cache Management

**Statistics**:
- Total cache size
- Hit/miss rate
- Eviction rate
- Memory usage

**Actions**:
- Clear cache
- Warm cache
- Adjust TTL

---

### 7. Data Quality

**Access**: ADMIN, OPS  
**Purpose**: Monitor data validation and lineage

#### Great Expectations Suites

**Validation Suites**:
1. **Orders Suite** (15 expectations)
   - Order total range checks
   - Status value validation
   - Referential integrity
   - Date consistency

2. **Products Suite** (12 expectations)
   - Price range validation
   - Stock non-negative
   - Category values
   - Required fields

3. **Users Suite** (8 expectations)
   - Email format
   - Unique constraints
   - Role validation

#### Suite Status Dashboard

**For Each Suite**:
- Total expectations
- Passed count (green)
- Failed count (red)
- Last run timestamp
- Trend indicator

#### Failed Expectations

**Details Shown**:
- Suite name
- Expectation type
- Column affected
- Failure details
- Sample bad values
- Severity level

**Actions**:
- Rerun validation
- View full report
- Create incident ticket
- Suppress false positive

#### Data Lineage

**dbt Integration**:
- Click "View Lineage" to open dbt docs
- Shows transformation DAG
- Model dependencies
- Column lineage

---

### 8. Dashboards (BI)

**Access**: ADMIN, ANALYST  
**Purpose**: Interactive analytics visualizations

#### Available Dashboards

**1. Executive Overview**
- Revenue trends (line chart)
- Order volume (bar chart)
- AOV and conversion (gauges)
- YoY/WoW comparison tables

**2. Acquisition Funnel**
- Funnel visualization
- Step-by-step conversion
- Drop-off analysis
- By device/source breakdown

**3. Cohort Retention**
- Cohort retention curves
- Monthly cohort tables
- Retention heatmap
- Lifetime value by cohort

**4. Product Performance**
- Top products table
- Sales by category (pie chart)
- Price band analysis
- Stock level alerts

**5. Churn Analysis**
- Churn risk distribution
- RFM segment movement
- Churn reasons (Sankey)
- Prevention ROI

#### Using Embedded Dashboards

**Navigation**:
- Use tabs to switch dashboards
- Click "Open in Superset" for full features
- Dashboards auto-refresh every 5 minutes

**Filters**:
- Date range selector
- Category filter
- Segment filter
- Custom SQL filter (ANALYST only)

**Export**:
- Download as PNG
- Export data as CSV
- Schedule email delivery

---

### 9. Settings

**Access**: ADMIN only  
**Purpose**: System configuration and user management

#### User Management

**Features**:
- List all users
- Assign roles
- Enable/disable MFA
- Reset passwords
- Audit user actions

#### API Keys

**Management**:
- Generate new API keys
- View key list (masked)
- Revoke keys
- Set expiration
- Scope permissions

**Display**:
- Key name
- Last 4 characters only
- Creation date
- Last used
- Permissions

#### Retention Policies

**Configurable**:
- Audit logs: 365 days (default)
- User sessions: 30 days
- Analytics data: 3 years
- Backups: 7 years
- Deleted accounts: 30 days

---

## Role-Based Access

### Permission Matrix

| Module | ADMIN | ANALYST | OPS | SUPPORT |
|--------|-------|---------|-----|---------|
| **Overview** | Read/Write | Read | Read | Read |
| **Customers** | Read/Write/Export | Read/Export | Read | Read (limited) |
| **Catalog** | Read/Write | Read | Read/Write | Read |
| **Forecasts** | Read/Write | Read/Export | Read | - |
| **Recommendations** | Read/Write | Read | - | - |
| **Experiments** | Read/Write | Read | - | - |
| **Data Quality** | Read/Write | Read | Read/Write | - |
| **Dashboards** | All | View/Export | View | - |
| **Settings** | Full | - | - | - |

### MFA Requirements

**Required for**:
- ADMIN role (always)
- Sensitive actions (promote model, export PII)
- Settings changes

**Setup**:
1. Go to Profile → Security
2. Scan QR code with authenticator app
3. Enter verification code
4. Save backup codes

---

## Data Export Guide

### Export Types

#### 1. CSV Export

**Available From**:
- Customer lists
- Churn predictions
- Forecast data
- Product catalog
- Experiment results

**Features**:
- Watermarked with user/date
- PII handling (hashed emails in some exports)
- Audit logged
- Size limits enforced

#### 2. PDF Reports

**Available From**:
- Experiment results
- Forecast summaries
- Executive KPI reports

**Includes**:
- Charts and visualizations
- Statistical summaries
- Metadata (who, when, filters)

#### 3. Scheduled Exports

**Setup**:
1. Navigate to module
2. Click "Schedule Export"
3. Select frequency (daily, weekly, monthly)
4. Choose format
5. Enter email recipients
6. Save

---

## Best Practices

### Security

✅ **Use MFA**: Always enable two-factor authentication  
✅ **Regular Password Rotation**: Every 90 days  
✅ **Audit Review**: Monthly review of audit logs  
✅ **Principle of Least Privilege**: Request minimum necessary access  
✅ **Secure Exports**: Never share exported files publicly  

### Performance

✅ **Use Date Filters**: Narrow queries to specific ranges  
✅ **Cache Awareness**: Understand refresh cycles  
✅ **Limit Result Sets**: Use pagination  
✅ **Schedule Heavy Queries**: Run large exports during off-hours  

### Data Quality

✅ **Monitor Alerts**: Check Data Quality dashboard daily  
✅ **Investigate Failures**: Root cause failing expectations  
✅ **Document Changes**: Add notes when updating catalog  
✅ **Validate Imports**: Preview bulk imports before committing  

### ML Operations

✅ **Review Metrics**: Check model performance weekly  
✅ **A/B Test Changes**: Never promote without testing  
✅ **Monitor Latency**: Ensure cache hit rates stay high  
✅ **Document Decisions**: Add notes when promoting models  

---

## Troubleshooting

### Login Issues

**Problem**: Cannot access admin portal  
**Solutions**:
1. Verify your email is registered in Keycloak
2. Check role assignment with IT admin
3. Clear browser cache and cookies
4. Try incognito mode
5. Contact support@easy11.com

### Dashboard Not Loading

**Problem**: Embedded dashboard shows error  
**Solutions**:
1. Check network connectivity
2. Verify Superset is running
3. Refresh the page
4. Clear cache
5. Check role permissions

### Export Failed

**Problem**: Export operation times out  
**Solutions**:
1. Reduce date range
2. Add more filters to narrow results
3. Schedule export instead of immediate
4. Try during off-peak hours

### Model Promotion Failed

**Problem**: Cannot promote candidate model  
**Solutions**:
1. Verify metrics meet thresholds
2. Check MLflow is accessible
3. Ensure you have ADMIN role
4. Verify MFA is completed
5. Check audit logs for details

---

## Support & Resources

### Documentation
- **Admin Portal Docs**: `/docs/admin-portal.md`
- **API Documentation**: `/docs/api_contracts.yaml`
- **Security Guide**: `/docs/security.md`
- **Architecture**: `/docs/architecture.md`

### Contact
- **Technical Support**: support@easy11.com
- **Security Issues**: security@easy11.com
- **Slack**: #easy11-support

### Training
- Video tutorials: [Link to training videos]
- Live training sessions: Monthly
- Knowledge base: https://docs.easy11.app

---

**Document Version**: 1.0  
**Last Review**: December 2024  
**Next Review**: March 2025

