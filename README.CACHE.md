# Cache Configuration for GitHub Pages

## Current Limitation

GitHub Pages automatically sets `Cache-Control: max-age=600` (10 minutes) for all assets, regardless of configuration attempts. This cannot be overridden through:

- `_headers` file (Netlify/Vercel only)
- `.htaccess` (Apache only)
- Custom server configuration (static hosting)

## Implemented Solutions

### 1. Hash-Based Filenames ✅

The `vite.config.ts` is configured with hash-based filenames:

```typescript
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
  },
}
```

**Benefits:**

- Each build generates unique filenames for changed files
- Unchanged files keep the same hash and remain cached
- Automatic cache busting without manual versioning
- Effective with GitHub Pages' 10-minute cache

### 2. .nojekyll File ✅

Prevents GitHub Pages from processing files through Jekyll, which can interfere with asset serving.

## Alternative Hosting Solutions

For longer cache lifetimes (1 year for hashed assets), consider:

### Netlify

Add `public/_headers`:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600

/sw.js
  Cache-Control: public, max-age=0, must-revalidate
```

### Vercel

Add `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Cloudflare Pages

Automatically respects `_headers` file (same format as Netlify).

## Performance Impact

While Lighthouse flags the 10-minute cache as suboptimal:

- **First-time visitors:** No difference (must download all assets)
- **Return visitors within 10 minutes:** Fully cached (0 downloads)
- **Return visitors after 10 minutes:** Re-validates all assets
  - Unchanged files: Minimal overhead (304 Not Modified responses)
  - Changed files: Downloads new versions automatically (thanks to hash-based filenames)

## Recommendations

1. **Current setup is production-ready** for GitHub Pages
2. For optimal performance, migrate to Netlify/Vercel/Cloudflare Pages
3. The hash-based filenames ensure cache correctness regardless of TTL
4. 10-minute cache is reasonable for personal projects with moderate traffic

## Testing Cache Behavior

```bash
# Check cache headers
curl -I https://johnrusu.github.io/react-notes/assets/index-DWGWlgJq.js

# Expected response:
# cache-control: max-age=600
# etag: "..."
```

## Future Improvements

- Implement service worker for client-side caching control
- Add preload/prefetch hints for critical assets
- Consider CDN proxy (e.g., Cloudflare) in front of GitHub Pages
