---
outline: deep
---

# Getting Started

## How it works

Rescuer is a service worker based static site server. It provides a rescue page for your site when it's down.

After registering the rescuer service worker, you can invoke rescuer's API to download a zip file containing your rescue page.
Rescuer will cache this file, and serve it as a static site at `/.rescue/`, regardless of your site's status.

When your site goes down, rescuer will redirect failed navigation requests to `/.rescue/`, so your users can still see your rescue page.

## Easy setup

If you do not want to customize service worker, you can setup rescuer within a few steps.
Please replace `VERSION` with the latest version number.

1. Save rescuer service worker to your site's root directory.

   ```bash
   curl -o sw.js https://cdn.jsdelivr.net/npm/@thezzisu/rescuer@VERSION/dist/sw.min.js
   ```

2. Add the following code to your site's `<head>`:

   ```html
   <script type="module">
     import {
       initializeRescue,
       updateRescue
     } from 'https://cdn.jsdelivr.net/npm/@thezzisu/rescuer@VERSION/dist/window.min.js'
     initializeRescue().then(() => {
       updateRescue('v0', 'https://example.org/rescue.zip')
     })
   </script>
   ```

That's all. Now you can visit `/.rescue/` to see your rescue page.

::: tip
The service worker registration is not guaranteed to be successful,
and due to network reachability, the rescue page may not be available immediately.
:::
