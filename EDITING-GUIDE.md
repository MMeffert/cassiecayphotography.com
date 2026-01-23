# How to Update Your Website

This guide is for Cassie to make updates via GitHub.

## Getting Started

1. Go to **github.com** and sign in with your Google account (cassiecayphoto@gmail.com)
2. Navigate to **MMeffert/cassiecayphotography.com**

---

## Making Text Changes

1. Click on **index.html**
2. Click the **pencil icon** (✏️) to edit
3. Use **Ctrl+F** (or **Cmd+F** on Mac) to find the text you want to change
4. Make your edits
5. Click **"Commit changes"** (green button)
6. Confirm with **"Commit changes"** in the popup

Changes go live in 2-3 minutes.

### Common Edits

| What | Search for |
|------|------------|
| About Me | `I'm Cassie` or your bio text |
| Contact info | Your email or phone |
| Services | `Family`, `Newborn`, etc. |

**Tip:** Don't change anything with `<` `>` brackets or `class=` — that's code!

---

## Adding New Photos

1. Go to the **`new-photos/`** folder
2. Click **"Add file"** → **"Upload files"**
3. Drag in your photos
4. Click **"Commit changes"**
5. Wait 2-3 minutes for processing

The workflow will:
- Optimize your images (AVIF, WebP, JPEG)
- Add HTML blocks to the bottom of the portfolio in `index.html`

### Moving Your New Photos

1. Open **index.html** and edit it
2. Find your new image blocks at the bottom (look for `MOVE THIS BLOCK START`)
3. Cut the entire block (from `START` to `END` comment)
4. Paste where you want it in the portfolio
5. Update the category if needed: change `family` to `milestone`, `senior`, `newborn`, or `couples`
6. Replace `[ADD DESCRIPTION]` with a description of the photo
7. Commit your changes

### Example Block to Move

```html
<!-- ========== MOVE THIS BLOCK START ========== -->
<!-- Image: filename | Category: family (options: family, milestone, senior, newborn, couples) -->
<div class="portfolio-item family">
  ...
</div>
<!-- ========== MOVE THIS BLOCK END ========== -->
```

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

## If Something Breaks

Don't panic! Mitchell can revert any change. Just let him know what happened.
