# Gallery Management Instructions

## How to Add/Reorder Images

### Step 1: Add Your Image
1. Upload your image file to the `images/` folder
2. Use a descriptive filename (e.g., `sunset-beach.jpg`)

### Step 2: Edit the Gallery Order
1. Open `gallery-config.json`
2. Add your image entry where you want it to appear:

```json
{
  "filename": "your-image.jpg",
  "title": "Your Image Title", 
  "description": "Brief description"
}
```

### Placement Examples:

**Add to beginning (position 1):**
```json
{
  "gallery": [
    {"filename": "new-image.jpg", "title": "New First Image", "description": "Now at the top"},
    {"filename": "sunset-beach.jpg", "title": "Sunset at the Beach", "description": "Golden hour magic"},
    ...
  ]
}
```

**Insert between existing images:**
```json
{
  "gallery": [
    {"filename": "sunset-beach.jpg", "title": "Sunset at the Beach", "description": "Golden hour magic"},
    {"filename": "new-image.jpg", "title": "New Middle Image", "description": "Between sunset and mountain"},
    {"filename": "mountain-peak.jpg", "title": "Mountain Peak", "description": "Early morning climb"},
    ...
  ]
}
```

### Step 3: Preview Your Changes
1. Create a Pull Request
2. Check the preview link that appears in the PR comments
3. The preview shows position numbers to verify placement

### Step 4: Publish
- Merge the PR to update the live gallery

## Tips:
- The order in the JSON file = the order in the gallery
- Position 1 = top-left, position 2 = next, etc.
- Always preview before merging!