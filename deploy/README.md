# Production deployment

The storefront is a static Vite build. The production server serves the
generated `dist/` directory through the dedicated Nginx virtual host for
`hosseintalab.ir`.

## Release flow

1. Run `npm run build` locally.
2. Upload `dist/` as a timestamped release under
   `/var/www/hosseintalab.ir/releases/`.
3. Atomically point `/var/www/hosseintalab.ir/current` at that release.
4. Test Nginx configuration before reload.
5. Verify both HTTPS and the canonical redirect from `www`.

`nginx/hosseintalab.ir.http.conf` is used only before the first certificate
is issued. `nginx/hosseintalab.ir.conf` is the final HTTPS configuration.
