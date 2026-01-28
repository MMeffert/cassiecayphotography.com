---
name: analytics
description: Query GA4 analytics for cassiecayphotography.com. Use to check traffic, sources, and engagement metrics.
---

# GA4 Analytics Query

Query Google Analytics 4 data for cassiecayphotography.com via the Data API.

## Configuration

```
GA4 Property ID: 269447426
GCP Quota Project: cassiecayphotographycom
```

## Process

### Step 1: Verify Authentication

Check if gcloud credentials are valid:

```bash
gcloud auth application-default print-access-token 2>&1 | head -1
```

**If error or "not found":** Run authentication flow:

```bash
gcloud auth application-default login \
  --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly"
```

Provide the user the URL to open manually if browser doesn't launch.

### Step 2: Query Analytics

Once authenticated, run these queries and format the results:

#### 30-Day Summary

```bash
TOKEN=$(gcloud auth application-default print-access-token)
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
    "metrics": [
      {"name": "sessions"},
      {"name": "activeUsers"},
      {"name": "newUsers"},
      {"name": "screenPageViews"},
      {"name": "averageSessionDuration"},
      {"name": "bounceRate"}
    ]
  }'
```

#### Daily Traffic (Last 7 Days)

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
    "dimensions": [{"name": "date"}],
    "metrics": [{"name": "sessions"}, {"name": "activeUsers"}, {"name": "screenPageViews"}],
    "orderBys": [{"dimension": {"dimensionName": "date"}}]
  }'
```

#### Traffic Sources

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
    "dimensions": [{"name": "sessionSource"}, {"name": "sessionMedium"}],
    "metrics": [{"name": "sessions"}, {"name": "activeUsers"}],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": true}],
    "limit": 10
  }'
```

#### Top Pages

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
    "dimensions": [{"name": "pagePath"}],
    "metrics": [{"name": "screenPageViews"}],
    "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": true}],
    "limit": 10
  }'
```

#### Devices

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
    "dimensions": [{"name": "deviceCategory"}],
    "metrics": [{"name": "sessions"}],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": true}]
  }'
```

#### Top Locations

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/269447426:runReport" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: cassiecayphotographycom" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
    "dimensions": [{"name": "city"}, {"name": "country"}],
    "metrics": [{"name": "sessions"}],
    "orderBys": [{"metric": {"metricName": "sessions"}, "desc": true}],
    "limit": 10
  }'
```

### Step 3: Format Output

Present the data in this format:

```markdown
## GA4 Analytics - Last 30 Days

### Overview
| Metric | Value |
|--------|-------|
| Sessions | X |
| Active Users | X |
| New Users | X |
| Page Views | X |
| Avg Session Duration | Xm Xs |
| Bounce Rate | X% |

### Daily Traffic (Last 7 Days)
| Date | Sessions | Users | Page Views |
|------|----------|-------|------------|
| ... | ... | ... | ... |

### Traffic Sources
| Source | Sessions | Users |
|--------|----------|-------|
| ... | ... | ... |

### Top Pages
| Page | Views |
|------|-------|
| ... | ... |

### Devices
| Device | Sessions | % |
|--------|----------|---|
| ... | ... | ... |

### Top Locations
| City | Sessions |
|------|----------|
| ... | ... |
```

## Common Dimensions & Metrics Reference

**Dimensions:** `date`, `pagePath`, `sessionSource`, `sessionMedium`, `deviceCategory`, `country`, `city`, `browser`, `operatingSystem`

**Metrics:** `sessions`, `activeUsers`, `newUsers`, `screenPageViews`, `averageSessionDuration`, `bounceRate`, `engagementRate`, `conversions`

## Custom Date Ranges

To query custom date ranges, modify the `dateRanges` parameter:
- Specific dates: `{"startDate": "2026-01-01", "endDate": "2026-01-31"}`
- Relative: `"7daysAgo"`, `"30daysAgo"`, `"90daysAgo"`, `"today"`, `"yesterday"`
