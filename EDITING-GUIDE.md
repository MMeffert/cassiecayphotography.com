# How to Update Your Website

This guide is for Cassie to make updates via GitHub.

## Getting Started

1. Go to **github.com** and sign in with your Google account (cassiecayphoto@gmail.com)
2. Navigate to **github.com/Meffert-House/cassiecayphotography.com**
3. Click the **"Code"** tab at the top (it should already be selected)

You'll see a list of files and folders. The main file you'll edit is **index.html**.

---

## Making Text Changes

1. From the Code tab, click on **index.html** to open it
2. Click the **pencil icon** (top right of the file content) to edit
3. Use **Ctrl+F** (or **Cmd+F** on Mac) to find the text you want to change
4. Make your edits
5. Click the green **"Commit changes..."** button (top right)
6. In the popup, click **"Commit changes"** to confirm

Changes go live after the deployment completes. You can monitor progress by clicking the **"Actions"** tab at the top of the page.

### Common Edits

| What | Search for |
|------|------------|
| About Me | `I'm Cassie` or your bio text |
| Contact info | Your email or phone |
| Services | `Family`, `Newborn`, etc. |

**Tip:** Don't change anything with `<` `>` brackets or `class=` — that's code!

---

## Adding New Photos

Photos go in different folders depending on where they'll appear on the site:

| Folder | Use For | What Happens |
|--------|---------|--------------|
| `new-photos/portfolio/` | Gallery photos | Creates responsive images + portfolio HTML |
| `new-photos/services/` | Service section images | Crops to square + creates octagon HTML |
| `new-photos/hero/` | Homepage slider | Creates full-size slider HTML |

### Adding Portfolio Photos

1. From the Code tab, click **`new-photos`** folder
2. Click **`portfolio`** folder
3. Click **"Add file"** (top right) → **"Upload files"**
4. Drag in your photos or click to browse
5. Scroll down and click **"Commit changes"**
6. Wait for processing to complete (check the **"Actions"** tab to monitor progress)

The workflow will:
- Optimize your images (AVIF, WebP, JPEG)
- Add HTML blocks to the bottom of `index.html`

#### Moving Your New Portfolio Photos

1. Go back to the Code tab and click **index.html**
2. Click the **pencil icon** to edit
3. Scroll to the bottom or use **Ctrl+F** to search for `MOVE THIS BLOCK START`
4. Select the entire block (from `START` comment to `END` comment)
5. Cut it (**Ctrl+X** or **Cmd+X**)
6. Scroll up to find where you want the photo in the portfolio
7. Paste it (**Ctrl+V** or **Cmd+V**)
8. Change the category if needed: replace `family` with `milestone`, `senior`, `newborn`, `couples`, or `wedding`
9. Replace `[ADD DESCRIPTION]` with a description of the photo
10. Click **"Commit changes..."** and confirm

### Adding Service Images

Service images appear next to each service description (Family, Wedding, Senior, etc.)

1. From the Code tab, click **`new-photos`** → **`services`**
2. Click **"Add file"** → **"Upload files"**
3. Upload your photo (any size — it will be automatically cropped to a square)
4. Click **"Commit changes"**
5. Wait for processing to complete (check the **"Actions"** tab to monitor progress)
6. Go back to the **Code** tab and click **index.html**, then click the **pencil icon** to edit
7. Search for `NEW SERVICE IMAGES TO PLACE` (at the bottom of the file)
8. Copy the `<figure>...</figure>` block for your image
9. Find the service you want to update (search for the service name like `Wedding, Event`)
10. Replace the existing `<figure>...</figure>` block with your new one
11. Update `[ADD DESCRIPTION]` with a description
12. Delete the comment block at the bottom once you've placed it
13. Click **"Commit changes..."** and confirm

### Adding Hero/Slider Images

Hero images appear in the homepage slideshow at the top.

1. From the Code tab, click **`new-photos`** → **`hero`**
2. Click **"Add file"** → **"Upload files"**
3. Upload your photo (use landscape orientation, at least 2000px wide works best)
4. Click **"Commit changes"**
5. Wait for processing to complete (check the **"Actions"** tab to monitor progress)
6. Go back to the **Code** tab and click **index.html**, then click the **pencil icon** to edit
7. Search for `NEW HERO SLIDES TO PLACE` (at the bottom of the file)
8. Copy the `<div class="embla__slide">...</div>` block
9. Search for `embla__container` to find the slider section
10. Paste your slide with the other `embla__slide` divs
11. Update `[ADD DESCRIPTION]` with a description
12. Delete the comment block at the bottom once you've placed it
13. Click **"Commit changes..."** and confirm

---

## Removing Photos

Contact Mitchell — he can help remove photos and their optimized versions.

---

## Uploading Client Photos (Zip Files)

Client photo downloads are stored separately from the website. To upload:

1. Go to **aws.amazon.com** and sign in
2. Search for **S3** and open it
3. Click on **cassiecayphotography.com-site-content**
4. Click on the **ClientPhotos** folder
5. Click **"Upload"** → drag in your zip file → click **"Upload"**

The download link will be:
`https://cassiecayphotography.com/ClientPhotos/YourFileName.zip`

---

## Quick Reference

| Task | Where to Go |
|------|-------------|
| Edit text | Code tab → index.html → pencil icon |
| Add portfolio photo | Code tab → new-photos → portfolio → Add file |
| Add service photo | Code tab → new-photos → services → Add file |
| Add hero/slider photo | Code tab → new-photos → hero → Add file |
| Upload client zip | AWS S3 → cassiecayphotography.com-site-content → ClientPhotos |

---

## If Something Breaks

Don't panic! Mitchell can revert any change. Just let him know what happened.
