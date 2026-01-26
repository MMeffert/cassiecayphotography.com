# How to Update Your Website

This guide will walk you through making changes to your photography website. Don't worry if you're not technical — just follow the steps and you'll be fine!

**Your website:** https://cassiecayphotography.com

---

## Table of Contents

1. [Getting Started with GitHub](#getting-started-with-github)
2. [Making Text Changes](#making-text-changes)
3. [Adding Photos to the Portfolio Gallery](#adding-photos-to-the-portfolio-gallery)
4. [Adding Photos to the Services Section](#adding-photos-to-the-services-section)
5. [Adding Photos to the Hero Slider](#adding-photos-to-the-hero-slider)
6. [Quick Navigation Markers](#quick-navigation-markers)
7. [If Something Breaks](#if-something-breaks)
8. [Quick Reference](#quick-reference)

---

## Getting Started with GitHub

GitHub is where your website files live. Think of it like a special folder in the cloud that automatically updates your website when you make changes.

### How to Sign In

1. Go to **github.com**
2. Sign in with your Google account: **cassiecayphoto@gmail.com**
3. You should see **MMeffert/cassiecayphotography.com** in your repositories
   - If you don't see it, go directly to: https://github.com/MMeffert/cassiecayphotography.com

### Understanding the File List

When you open the repository, you'll see a list of files and folders:

| File/Folder | What it is |
|-------------|------------|
| **index.html** | Your entire website — this is where you edit text and move photo blocks |
| **new-photos/** | Where you upload new photos (has subfolders for different sections) |
| **images/** | Where your original photos are stored |
| **images-optimized/** | Where the system puts optimized versions (don't touch this) |
| **EDITING-GUIDE.md** | This guide you're reading now |

---

## Making Text Changes

This is the most common edit you'll make — changing words, prices, descriptions, etc.

### Step-by-Step Instructions

1. **Open the repository** at https://github.com/MMeffert/cassiecayphotography.com

2. **Click on `index.html`** in the file list

3. **Click the pencil icon** (✏️) in the top-right corner to edit the file

4. **Find what you want to change:**
   - Press **Cmd+F** (Mac) or **Ctrl+F** (Windows) to open the search box
   - Type the text you're looking for (see [Quick Navigation Markers](#quick-navigation-markers) below for shortcuts)

5. **Make your edit:**
   - Click in the file where you want to change something
   - Delete the old text and type the new text
   - **Only change the words** — don't change anything with `<` or `>` brackets

6. **Save your changes:**
   - Scroll down to find the green **"Commit changes"** button
   - Click it
   - A popup will appear — you can leave the default message or write something like "Updated pricing"
   - Click **"Commit changes"** again to confirm

7. **Wait for the update:**
   - Your changes will go live in **2-3 minutes**
   - Visit https://cassiecayphotography.com and refresh the page to see your changes

### What NOT to Change

**Don't change anything that looks like code.** Here's how to tell the difference:

| This is TEXT (OK to change) | This is CODE (don't touch) |
|----------------------------|---------------------------|
| `$350` | `<div class="pricing">` |
| `Family portraits` | `class="portfolio-item family"` |
| `cassiecayphoto@gmail.com` | `href="mailto:..."` |
| `I'm Cassie, a photographer...` | `<section id="about">` |

**Rule of thumb:** If it has `<`, `>`, `=`, or `"` with weird words, it's code. Leave it alone.

---

## Adding Photos to the Portfolio Gallery

The portfolio is the main gallery on your website where clients browse your work. Photos here are organized by category (family, newborn, senior, etc.) and visitors can filter them.

### Step 1: Upload Your Photos

1. **Go to the `new-photos` folder:**
   - From the main repository page, click on the **`new-photos`** folder
   - You'll see three subfolders — stay in the main `new-photos` folder (don't click into portfolio, services, or hero)

2. **Upload your images:**
   - Click **"Add file"** → **"Upload files"**
   - Drag your photos into the upload area, or click to browse your computer
   - Use JPG or PNG files (JPG is preferred for photos)
   - You can upload multiple photos at once

3. **Save the upload:**
   - Scroll down and click the green **"Commit changes"** button
   - Click **"Commit changes"** again in the popup

4. **Wait for processing:**
   - The system will automatically process your photos (this takes 2-5 minutes)
   - It creates optimized versions in different sizes so your website loads fast
   - When finished, it adds HTML blocks to `index.html` for you to position

### Step 2: Position Your New Photos

After the processing is complete, you need to move each photo to where you want it in the gallery.

1. **Open `index.html` for editing** (click pencil icon)

2. **Find your new photo blocks:**
   - Press **Cmd+F** (Mac) or **Ctrl+F** (Windows)
   - Search for `MOVE THIS BLOCK`
   - You'll find blocks that look like this:

```
<!-- ========== MOVE THIS BLOCK START ========== -->
<!-- Image: your-photo.jpg | Category: family (options: family, milestone, senior, newborn, couples, wedding) -->
<div class="portfolio-item family">
  ... (more code here) ...
</div>
<!-- ========== MOVE THIS BLOCK END ========== -->
```

3. **Move the block:**
   - Select the **entire block** from `MOVE THIS BLOCK START` to `MOVE THIS BLOCK END` (including those lines)
   - Cut it (**Cmd+X** on Mac, **Ctrl+X** on Windows)
   - Find where you want the photo to appear in the gallery (search for `[EDIT:PORTFOLIO]` to find the portfolio section)
   - Paste it in the right spot (**Cmd+V** on Mac, **Ctrl+V** on Windows)

4. **Set the category:**
   - Find the line that says `class="portfolio-item family"`
   - Change `family` to the correct category:
     - `family` — Family portraits
     - `milestone` — Milestone sessions (1 year, cake smash, etc.)
     - `senior` — Senior portraits
     - `newborn` — Newborn sessions
     - `couples` — Couples and engagement photos
     - `wedding` — Wedding photos

5. **Add a description:**
   - Find `[ADD DESCRIPTION]` in the block
   - Replace it with a brief description like "Smith family fall session" or "Newborn baby girl"
   - This helps with accessibility and search engines

6. **Delete the marker comments:**
   - Remove the lines that say `MOVE THIS BLOCK START` and `MOVE THIS BLOCK END`
   - These are just there to help you find new photos

7. **Save your changes:**
   - Scroll down and click **"Commit changes"**
   - Click **"Commit changes"** again to confirm

---

## Adding Photos to the Services Section

Service images are the photos that appear next to each service description (Full Session, Wedding, etc.). These are automatically **cropped to a square shape** (500×500 pixels).

### Step 1: Upload Your Service Photo

1. **Go to the services subfolder:**
   - From the main repository, click **`new-photos`** → **`services`**

2. **Upload your image:**
   - Click **"Add file"** → **"Upload files"**
   - Drag in your photo
   - **Tip:** Choose a photo that looks good cropped to a square — the system will automatically focus on the most important part

3. **Commit the upload:**
   - Click **"Commit changes"** and confirm

4. **Wait for processing** (2-5 minutes)

### Step 2: Place Your Service Photo

The system adds service photos as comments at the bottom of `index.html`. You need to manually place them.

1. **Open `index.html` for editing**

2. **Find your new service image:**
   - Search for `NEW SERVICE IMAGE`
   - You'll find a block like this:

```
<!-- ========== NEW SERVICE IMAGE: your-photo.jpg ========== -->
<!-- Copy this block to replace an existing service image -->
<figure><picture>
  ... (image code) ...
</picture></figure>
<!-- ========== END SERVICE IMAGE ========== -->
```

3. **Find the service you want to update:**
   - Search for the service marker (see [Quick Navigation Markers](#quick-navigation-markers))
   - For example, search for `[SERVICE:Full-Session]` to find the Full Session service

4. **Replace the old image:**
   - Find the existing `<figure><picture>` block for that service
   - Select and delete the old `<figure>...</figure>` block
   - Paste your new `<figure><picture>...</picture></figure>` block in its place
   - **Don't paste the comment lines** — just the `<figure>` to `</figure>` part

5. **Update the description:**
   - Find `[ADD DESCRIPTION]` and replace with something like "Family portrait session"

6. **Delete the leftover comment block** at the bottom of the file

7. **Commit your changes**

---

## Adding Photos to the Hero Slider

The hero slider is the large rotating banner at the top of your website. These photos are displayed at **full size** to make an impact.

### Step 1: Upload Your Hero Photo

1. **Go to the hero subfolder:**
   - From the main repository, click **`new-photos`** → **`hero`**

2. **Upload your image:**
   - Click **"Add file"** → **"Upload files"**
   - Drag in your photo
   - **Tip:** Use high-resolution, horizontal (landscape) photos for best results

3. **Commit the upload** and wait for processing (2-5 minutes)

### Step 2: Add the Slide to the Hero Section

1. **Open `index.html` for editing**

2. **Find your new hero image:**
   - Search for `NEW HERO SLIDE`
   - You'll find a block like this:

```
<!-- ========== NEW HERO SLIDE: your-photo.jpg ========== -->
<!-- Add this inside the .embla__container div -->
<div class="embla__slide">
  <img src="images-optimized/jpeg/full/your-photo.jpg" alt="[ADD DESCRIPTION]">
</div>
<!-- ========== END HERO SLIDE ========== -->
```

3. **Find the hero slider section:**
   - Search for `[EDIT:HERO]` or `embla__container`

4. **Add your slide:**
   - Copy just the `<div class="embla__slide">...</div>` part (not the comments)
   - Paste it inside the `.embla__container` div, alongside the other slides

5. **Update the description:**
   - Replace `[ADD DESCRIPTION]` with something like "Outdoor family portrait"

6. **Delete the leftover comment block** at the bottom of the file

7. **Commit your changes**

---

## Quick Navigation Markers

The website has special markers you can search for to jump directly to each section:

### Main Sections

| To edit... | Search for |
|------------|------------|
| Hero slider images | `[EDIT:HERO]` |
| About me section | `[EDIT:ABOUT]` |
| Photo gallery | `[EDIT:PORTFOLIO]` |
| Services & pricing | `[EDIT:SERVICES]` |
| Contact section | `[EDIT:CONTACT]` |

### Individual Services

| Service | Search for |
|---------|------------|
| Full Session ($350) | `[SERVICE:Full-Session]` |
| Wedding/Event ($350/hr) | `[SERVICE:Wedding]` |
| Compact Session ($250) | `[SERVICE:Compact]` |
| Senior portraits ($400) | `[SERVICE:Senior]` |
| Fresh 48 hospital ($300) | `[SERVICE:Fresh48]` |
| Newborn session ($450) | `[SERVICE:Newborn]` |

### Other Common Searches

| What | Search for |
|------|------------|
| About Me text | `I'm Cassie` |
| Email address | `cassiecayphoto@gmail.com` |
| Phone number | Your phone number |
| Any price | The dollar amount like `$350` |

---

## If Something Breaks

**Don't panic!** Every change you make is saved in GitHub's history. Mitchell can always undo any mistake.

### What to Do

1. **Stop making more changes** — don't try to "fix" it yourself
2. **Take a screenshot** of what looks wrong
3. **Contact Mitchell** and let him know:
   - What you were trying to do
   - What happened instead
   - When it happened

Mitchell can restore your website to any previous version within minutes.

### Common Issues

| Problem | Solution |
|---------|----------|
| Website looks broken | Wait 5 minutes, then refresh. If still broken, contact Mitchell. |
| Photo not showing up | Make sure you committed the changes. Check back in 5 minutes. |
| Text formatting looks weird | You may have accidentally changed some code. Contact Mitchell. |
| Changes not appearing | Clear your browser cache or try a different browser. |

---

## Quick Reference

### Upload Locations

| I want to add... | Upload to this folder |
|------------------|----------------------|
| Gallery photos | `new-photos/` (main folder) |
| Service section photos | `new-photos/services/` |
| Hero slider photos | `new-photos/hero/` |

### Photo Processing Summary

| Folder | What happens |
|--------|--------------|
| `new-photos/` | Optimized → Auto-inserted into portfolio → You move it to the right spot |
| `new-photos/services/` | Cropped to square → Added as comment → You manually place it |
| `new-photos/hero/` | Optimized full-size → Added as comment → You manually add to slider |

### Basic Workflow

1. **To edit text:** Open `index.html` → Click pencil → Find text → Edit → Commit changes
2. **To add gallery photos:** Upload to `new-photos/` → Wait → Move blocks in `index.html` → Commit
3. **To add service photos:** Upload to `new-photos/services/` → Wait → Replace old image in `index.html` → Commit
4. **To add hero photos:** Upload to `new-photos/hero/` → Wait → Add slide in `index.html` → Commit

### Important Links

- **Your website:** https://cassiecayphotography.com
- **GitHub repository:** https://github.com/MMeffert/cassiecayphotography.com
- **This editing guide:** https://github.com/MMeffert/cassiecayphotography.com/blob/main/EDITING-GUIDE.md

---

## Removing Photos

For now, contact Mitchell to remove photos. Removal requires:
- Deleting the image files
- Removing the HTML code
- Cleaning up optimized versions

It's easy to accidentally break something, so let Mitchell handle this for you.

---

*Last updated: January 2025*
