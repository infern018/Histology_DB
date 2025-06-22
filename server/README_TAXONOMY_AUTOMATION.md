# 🚀 Automated Taxonomy Order Population System

## Overview

This system completely automates the taxonomy order population process, eliminating the need for manual intervention with `orderScript.js`, `unzipPython.ipynb`, and `orderPopulation.js`.

## 🎯 **How It Works**

### **3-Tier Fallback System:**

1. **MongoDB Cache** (Fastest) - Instant lookup from TaxonomyCache collection
2. **JSON File** (Legacy) - Falls back to existing `combined_taxonomy_reports.json`
3. **Background Processing** - Queues missing orders for API fetching

### **Automatic Processing:**

-   **Real-time**: Orders populated during entry creation/update
-   **Background**: Cron job runs every hour to fill missing orders
-   **Quick Processing**: Every 15 minutes for recent entries

## 📁 **New Files Added**

```
server/
├── models/TaxonomyCache.js          # MongoDB model for caching taxonomy data
├── services/taxonomyService.js      # Core taxonomy management service
├── jobs/taxonomyCronJob.js          # Automated background processing
├── routes/taxonomy.js               # Admin API endpoints
└── scripts/migrateTaxonomyData.js   # One-time migration script
```

## 🔧 **Setup & Migration**

### 1. **Install Dependencies**

```bash
npm install node-cron
```

### 2. **Run Migration** (One-time)

```bash
node scripts/migrateTaxonomyData.js
```

### 3. **Start Server**

The cron job starts automatically when the server starts.

## 🛠 **API Endpoints**

### Admin Endpoints:

-   `GET /api/taxonomy/status` - View cache statistics
-   `POST /api/taxonomy/migrate` - Run migration manually
-   `POST /api/taxonomy/process` - Trigger background processing
-   `POST /api/taxonomy/cron-run` - Run cron job manually

### Utility Endpoints:

-   `GET /api/taxonomy/cache/:taxId` - View cached data for taxonomy ID
-   `POST /api/taxonomy/order/:taxId` - Get order (triggers caching if needed)

## 📊 **System Benefits**

### ✅ **Before vs After**

| **Before (Manual)**     | **After (Automated)**      |
| ----------------------- | -------------------------- |
| 3-step manual process   | Fully automated            |
| Manual script execution | Background processing      |
| JSON file dependency    | MongoDB + JSON fallback    |
| No real-time updates    | Real-time order population |
| Risk of missing steps   | Self-healing system        |

### 🚀 **Performance**

-   **MongoDB Cache**: ~1ms lookup
-   **JSON Fallback**: ~10ms lookup
-   **API Processing**: Background (no user wait)

## 🔄 **Background Processing**

### **Cron Schedule:**

-   **Every Hour**: Full processing (up to 20 entries)
-   **Every 15 Minutes**: Quick processing (up to 5 entries)

### **Smart Queuing:**

-   Avoids duplicate processing
-   Rate limiting to prevent API abuse
-   Graceful error handling with fallbacks

## 🎛 **Configuration**

### **Environment Variables:**

```env
NCBI_API_KEY=your_api_key_here  # Optional: for higher rate limits
MONGO_URL=your_mongodb_url      # Required: MongoDB connection
```

### **Cron Job Tuning:**

Edit `server/jobs/taxonomyCronJob.js` to adjust:

-   Processing frequency
-   Batch sizes
-   Rate limiting delays

## 🚨 **Monitoring**

### **Check System Status:**

```bash
curl http://localhost:8000/api/taxonomy/status
```

### **Expected Response:**

```json
{
	"success": true,
	"stats": {
		"totalCached": 1250,
		"withOrders": 1180,
		"pending": 70,
		"completion": "94.40%"
	}
}
```

## 🔧 **Troubleshooting**

### **Issue: Orders not populating**

```bash
# Check cron job status
curl -X POST http://localhost:8000/api/taxonomy/cron-run

# Manually process entries
curl -X POST http://localhost:8000/api/taxonomy/process \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'
```

### **Issue: Migration needed**

```bash
# Run migration
curl -X POST http://localhost:8000/api/taxonomy/migrate
```

## 🎯 **Migration Path**

### **Phase 1: Setup** ✅

-   [x] Install new system alongside existing
-   [x] Run migration script
-   [x] Verify functionality

### **Phase 2: Transition**

-   [ ] Monitor system for 1 week
-   [ ] Verify all orders are populating correctly
-   [ ] Performance testing

### **Phase 3: Cleanup**

-   [ ] Remove old manual scripts (optional)
-   [ ] Archive `combined_taxonomy_reports.json` (keep as backup)
-   [ ] Update deployment scripts

## 📈 **Expected Results**

After migration, you should see:

-   ✅ **Zero manual intervention** needed for order population
-   ✅ **Real-time order updates** during entry creation
-   ✅ **Background healing** of missing orders
-   ✅ **Improved performance** with MongoDB caching
-   ✅ **Better error handling** and resilience

---

## 🎉 **Success!**

Your taxonomy order population is now **fully automated**!

The system will:

1. **Populate orders immediately** during entry creation
2. **Queue missing orders** for background processing
3. **Self-heal** any gaps automatically
4. **Maintain high performance** with smart caching

**No more manual scripts needed!** 🚀
