# More Lake

[morelake.org](https://morelake.org) — a protest you can wear. More water in the Great Salt Lake, fewer data centers draining it.

## What this is

A static site (HTML, CSS, vanilla JS). No build step, no framework. Four pages:

- `index.html` — shop / product (animated dithered Great Salt Lake hero on a canvas)
- `about.html` — the cause, the facts, FAQ
- `wholesale.html` — bulk inquiry form
- `contact.html` — contact form

The lake hero is a live `<canvas>` that renders the Great Salt Lake (silhouette traced from the shirt art) as a dithered dot field with a shoreline that recedes and fills.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploy (Vercel)

Static, no build:

- Framework preset: **Other**
- Build command: none
- Output directory: `./`

Connect this repo in Vercel and it auto-deploys on every push to `main`.

## To do

- Wire Shopify checkout (Buy Button)
- Connect the email signup + contact/wholesale forms to a real endpoint
- Set up `hello@morelake.org`
