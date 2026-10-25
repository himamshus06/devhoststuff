KAYAKA React + Vite source

The existing marketplace JSX/CSS has been preserved. The navbar logo now uses the supplied image at public/kayaka-logo.png.

## Core features

- Browse a curated artisan marketplace with craft filters, search, sorting, favorites, and responsive product cards.
- View product details, artisan stories, and individual artisan shop pages.
- Add pieces to a persistent shopping bag, adjust quantities, and complete a local demo checkout with order confirmation.
- Create buyer or seller demo accounts; seller accounts support Aadhaar-linked local identity verification with only a hash and final four digits stored.
- Publish seller listings with up to five compressed photos, inventory details, product stories, and optional voice input.
- Switch between English and Kannada throughout the marketplace and seller dashboard.
- Keep demo accounts, listings, cart contents, language preference, and orders in the browser via local storage.

This is a frontend prototype: authentication, payments, and order storage are local-demo experiences rather than production services.

To use:
1. Copy the src files and public/kayaka-logo.png into your existing Vite project (or use the included full source folder).
2. Ensure react, react-dom, react-router-dom, and lucide-react are installed.
3. Run npm run dev.

Logo implementation is in src/App.jsx (Brand component) and src/index.css (responsive logo sizing).
