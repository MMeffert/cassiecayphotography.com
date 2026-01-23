# Phase 14: Contact Form Migration - Research

**Researched:** 2026-01-21
**Domain:** Form submission, fetch API, reCAPTCHA Enterprise, vanilla JS validation
**Confidence:** HIGH

## Summary

This phase converts the contact form from jQuery AJAX to native fetch API, replacing all jQuery calls with vanilla JavaScript equivalents. The current implementation in `index.html` (lines 8-74) uses jQuery for form validation, AJAX submission, and DOM manipulation.

The form already uses reCAPTCHA Enterprise v3 (invisible/score-based) with a working Lambda backend. The migration preserves this integration while removing jQuery dependency. The approach is straightforward: the existing jQuery patterns map directly to modern fetch API equivalents.

**Primary recommendation:** Convert the `submitToAPI()` function to use fetch API with async/await, replace jQuery DOM operations with `document.getElementById()` and `querySelector()`, and use the Constraint Validation API for form validation.

## Current Implementation Audit

### jQuery Calls in Contact Form (index.html lines 8-74)

| Line | jQuery Call | Purpose | Vanilla JS Equivalent |
|------|-------------|---------|----------------------|
| 13 | `$("#name").val()` | Get name input value | `document.getElementById('name').value` |
| 17 | `$("#mail").val()` | Get email input value | `document.getElementById('mail').value` |
| 23 | `$("#mail").val()` | Email validation | `document.getElementById('mail').value` |
| 29 | `$("#submitmessage").prop('disabled', true).text('Sending...')` | Disable button + change text | `btn.disabled = true; btn.textContent = 'Sending...'` |
| 37 | `$("#name").val()` | Build data object | `document.getElementById('name').value` |
| 38 | `$("#mail").val()` | Build data object | `document.getElementById('mail').value` |
| 39 | `$("#subject").val()` | Build data object | `document.getElementById('subject').value` |
| 40 | `$("#comment").val()` | Build data object | `document.getElementById('comment').value` |
| 44-66 | `$.ajax({...})` | POST to Lambda | `fetch(url, options)` |
| 53 | `$("#message").css('color', 'green')` | Style success message | `el.style.color = 'green'` |
| 54 | `$("#message").text(...)` | Set success text | `el.textContent = '...'` |
| 59 | `$("#submitmessage").prop('disabled', false).text('Send Message')` | Re-enable button | `btn.disabled = false; btn.textContent = '...'` |
| 62-64 | `$("#message").css() + .text()` | Style error message | `el.style.color + el.textContent` |
| 69-71 | `$("#message").css() + .text()` | reCAPTCHA error | Same as above |

**Total jQuery calls:** 18 (matches STATE.md blocker count)

### Current Form HTML Structure (index.html lines 1371-1405)

```html
<form id="contact-form" action="post">
  <input type="text" id="name" name="name" placeholder="Your name" required>
  <input type="email" id="mail" name="mail" placeholder="Your e-mail" required>
  <input type="text" id="subject" name="subject" placeholder="Subject">
  <textarea id="comment" name="comment" rows="3" placeholder="..." required></textarea>
  <button type="button" id="submitmessage" onClick="submitToAPI(event)">Send Message</button>
  <p id="message"></p>
</form>
```

### reCAPTCHA Enterprise Configuration

- **Type:** Score-based (v3-style, invisible)
- **Site Key:** `6LchXjYsAAAAANiJ_B8AKMUp7vwsJx_8HnKLBzr2`
- **Action:** `contact_submit`
- **Script:** `https://www.google.com/recaptcha/enterprise.js?render=SITE_KEY`
- **Badge visibility:** Hidden via CSS `.grecaptcha-badge { visibility: hidden; }`
- **API methods:** `grecaptcha.enterprise.ready()`, `grecaptcha.enterprise.execute()`

### Lambda Backend (infrastructure/lambda/contact-form/index.js)

The Lambda function expects this JSON payload:
```json
{
  "site": "cassiecayphotography.com",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "recaptchaToken": "string"
}
```

Returns:
- `200`: `{ "result": "Success" }`
- `400`: `{ "result": "Failed", "reason": "reCAPTCHA verification failed" }`
- `500`: `{ "result": "Failed", "reason": "Email service error" }`

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Fetch API | Native | HTTP requests | Built into all modern browsers, replaces $.ajax |
| Constraint Validation API | Native | Form validation | Built-in, no library needed |
| async/await | ES2017+ | Promise handling | Cleaner than callbacks, wide browser support |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| reCAPTCHA Enterprise JS | Latest | Bot protection | Already loaded, no changes needed |
| AbortController | Native | Request cancellation | Optional, for advanced timeout handling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fetch | Axios | Axios adds 11KB, fetch is native |
| Custom validation | Pristine/VeeValidate | Overkill for 4 fields, adds dependencies |
| Native validation | Custom JS only | HTML5 validation provides free accessibility |

**Installation:** None required. All APIs are native browser features.

## Architecture Patterns

### Recommended Code Structure

```
submitToAPI() function in <head> → Move to custom-scripts.js
├── validateForm() - Uses Constraint Validation API
├── setFormLoading(boolean) - Manages button state
├── showMessage(type, text) - Displays feedback
└── submitFormData() - async fetch POST
```

### Pattern 1: Fetch POST with JSON

**What:** Standard fetch call replacing $.ajax
**When to use:** All form submissions to API endpoints

```javascript
// Source: MDN Fetch API documentation
async function submitFormData(data) {
    const response = await fetch('https://api.example.com/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
}
```

### Pattern 2: Constraint Validation API

**What:** Native browser validation with custom messages
**When to use:** Form field validation before submission

```javascript
// Source: MDN Form Validation documentation
function validateForm(form) {
    // Check if form is valid using native API
    if (!form.checkValidity()) {
        // Trigger native validation UI
        form.reportValidity();
        return false;
    }

    // Custom validation beyond HTML5 constraints
    const email = document.getElementById('mail');
    if (!email.validity.valid) {
        email.setCustomValidity('Please enter a valid email address');
        email.reportValidity();
        return false;
    }

    return true;
}
```

### Pattern 3: reCAPTCHA Enterprise Integration

**What:** Invisible score-based reCAPTCHA execution
**When to use:** Before form submission to get token

```javascript
// Source: Google Cloud reCAPTCHA documentation
async function getRecaptchaToken(action) {
    return new Promise((resolve, reject) => {
        grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute('SITE_KEY', { action })
                .then(resolve)
                .catch(reject);
        });
    });
}
```

### Anti-Patterns to Avoid

- **Mixing jQuery and vanilla JS:** Don't partially migrate. Convert all form-related jQuery in one pass.
- **Ignoring HTTP errors:** fetch() only rejects on network failure. Always check `response.ok`.
- **Blocking validation messages:** Don't use `alert()`. Use inline error display.
- **Hardcoding URLs:** The Lambda URL is already in the code. Don't change it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom regex-only validation | Constraint Validation API | Native API handles edge cases, accessibility, i18n |
| Email validation | Complex regex | `type="email"` + validity.typeMismatch | Browser regex is battle-tested |
| Button state management | Custom loading class | `disabled` attribute + textContent | Simpler, more accessible |
| Error display | Custom modal/toast | Existing `#message` element | Already styled, matches site design |

**Key insight:** The existing form structure and styling works. The migration only changes the JavaScript implementation, not the UX.

## Common Pitfalls

### Pitfall 1: fetch Doesn't Reject on HTTP Errors

**What goes wrong:** Code assumes fetch rejects on 400/500 responses, but it only rejects on network failures.
**Why it happens:** Developers expect $.ajax error callback behavior.
**How to avoid:** Always check `response.ok` before processing response.
**Warning signs:** Errors show "Success" message because catch block never runs.

```javascript
// WRONG - catch only handles network errors
try {
    const response = await fetch(url, options);
    const data = await response.json();
    showSuccess(); // Runs even on 400/500!
} catch (error) {
    showError(); // Only runs on network failure
}

// CORRECT - explicitly check status
const response = await fetch(url, options);
if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
}
const data = await response.json();
```

### Pitfall 2: Forgetting Content-Type Header

**What goes wrong:** Server receives empty body or malformed data.
**Why it happens:** $.ajax auto-sets Content-Type, fetch doesn't.
**How to avoid:** Always set `'Content-Type': 'application/json'` for JSON payloads.
**Warning signs:** Lambda logs show empty event.body.

### Pitfall 3: Form Submits Despite preventDefault

**What goes wrong:** Page reloads on form submit, losing user input.
**Why it happens:** Button uses `onClick` handler, form action="post" exists.
**How to avoid:** Change button to `type="button"` (already done) or call `e.preventDefault()` in handler.
**Warning signs:** Page refreshes on submit.

### Pitfall 4: reCAPTCHA Token Expiration

**What goes wrong:** Token becomes invalid before submission.
**Why it happens:** Tokens expire after 2 minutes; user takes too long.
**How to avoid:** Generate token immediately before fetch, not on page load.
**Warning signs:** Lambda returns "Invalid token" error.

### Pitfall 5: Input Values Read After Clear

**What goes wrong:** Empty data sent to server.
**Why it happens:** Code clears inputs before reading them.
**How to avoid:** Build data object before clearing form fields.
**Warning signs:** Email contains empty name/message.

## Code Examples

### Complete Migration Pattern

```javascript
// Source: MDN Fetch API + Constraint Validation API
async function submitToAPI(e) {
    e.preventDefault();

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submitmessage');
    const messageEl = document.getElementById('message');

    // Validate using Constraint Validation API
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    messageEl.textContent = '';

    try {
        // Get reCAPTCHA token
        const token = await new Promise((resolve, reject) => {
            grecaptcha.enterprise.ready(() => {
                grecaptcha.enterprise.execute(
                    '6LchXjYsAAAAANiJ_B8AKMUp7vwsJx_8HnKLBzr2',
                    { action: 'contact_submit' }
                ).then(resolve).catch(reject);
            });
        });

        // Build form data
        const data = {
            site: 'cassiecayphotography.com',
            name: document.getElementById('name').value,
            email: document.getElementById('mail').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('comment').value,
            recaptchaToken: token
        };

        // Submit via fetch
        const response = await fetch(
            'https://7qcdrfk7uctpaqw36i5z2kwxha0rgrnx.lambda-url.us-east-1.on.aws/',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Success - clear form
        messageEl.style.color = 'green';
        messageEl.textContent = 'Message Sent Successfully';
        form.reset();

    } catch (error) {
        // Error - show message
        messageEl.style.color = 'red';
        if (error.message.includes('reCAPTCHA')) {
            messageEl.textContent = 'reCAPTCHA error. Please try again.';
        } else {
            messageEl.textContent = 'Error. Your message was not sent.';
        }
        console.error('Form submission error:', error);
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}
```

### HTML5 Validation Attributes (Current vs Enhanced)

```html
<!-- Current (adequate) -->
<input type="text" id="name" name="name" required>
<input type="email" id="mail" name="mail" required>

<!-- Enhanced (optional) -->
<input type="text" id="name" name="name" required minlength="2"
       title="Name must be at least 2 characters">
<input type="email" id="mail" name="mail" required
       title="Please enter a valid email address">
```

### Error Message Display Pattern

```javascript
// Source: web.dev fetch error handling best practices
function showMessage(type, text) {
    const messageEl = document.getElementById('message');
    messageEl.style.color = type === 'success' ? 'green' : 'red';
    messageEl.textContent = text;

    // Optional: announce to screen readers
    messageEl.setAttribute('role', 'alert');
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| $.ajax() | fetch() | ES2015+ | Native, no jQuery needed |
| $.val() | .value property | Always available | Direct DOM access |
| Callback hell | async/await | ES2017+ | Cleaner error handling |
| alert() for errors | Inline messages | UX best practice | Better user experience |
| Custom regex validation | Constraint Validation API | HTML5 | Browser-native, accessible |

**Deprecated/outdated:**
- XMLHttpRequest: Replaced by fetch API
- jQuery $.ajax: Unnecessary with native fetch
- Synchronous validation: Use async patterns for reCAPTCHA integration

## Open Questions

1. **Form field minlength validation**
   - What we know: Current JS validates name >= 2 chars manually
   - What's unclear: Should we add `minlength="2"` to HTML or keep JS validation?
   - Recommendation: Add HTML attribute for progressive enhancement, remove JS check

2. **Error message specificity**
   - What we know: Lambda returns specific error reasons
   - What's unclear: Should we display "reCAPTCHA verification failed" vs generic "Error"?
   - Recommendation: Keep generic user messages, log specific errors to console

## Sources

### Primary (HIGH confidence)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - POST request patterns, headers, error handling
- [MDN: Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation) - Constraint Validation API, HTML5 attributes
- [Google Cloud: reCAPTCHA JavaScript API](https://docs.cloud.google.com/recaptcha/docs/api-ref-checkbox-keys) - execute(), ready() methods

### Secondary (MEDIUM confidence)
- [web.dev: Fetch API error handling](https://web.dev/articles/fetch-api-error-handling) - Error handling best practices
- [Simon Plenderleith: POST form data with fetch](https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/) - JSON submission patterns

### Tertiary (LOW confidence)
- [Strapi: Vanilla JavaScript Form Handling](https://strapi.io/blog/vanilla-javascript-form-handling-guide) - General patterns
- [GeeksforGeeks: AJAX vs Fetch](https://www.geeksforgeeks.org/javascript/difference-between-ajax-and-fetch-api/) - Migration considerations

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native browser APIs, well-documented
- Architecture: HIGH - Direct mapping from jQuery to vanilla equivalents
- Pitfalls: HIGH - Based on official documentation and common patterns

**Research date:** 2026-01-21
**Valid until:** Stable - native APIs don't change frequently
