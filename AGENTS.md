<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# NextZone Movies - Development Guidelines

This project (`NextZone Movies`) is an independent, standalone movie streaming and viewing platform built for local development on `http://localhost:3000`.

# Core Rules:
1. **100% Independent Project**: This codebase (`nextzone`) is strictly dedicated to the NextZone Movies streaming platform and operates completely separate from the Movies Review Website (`http://localhost:3001`).
2. **Local Preview**: All changes are tested locally on `http://localhost:3000`. No remote deployments required.
3. **Clean Video Player Standard**: Always use custom chromeless video player frames (`NextZonePlayer` / `IntegratedPlayer`) for video embeds and movie streaming.
4. **Zero Third-Party Branding & Ads**: Maintain 100% clean video frames and UI with zero third-party ads, zero ad shields, zero recommendation popups, and zero third-party logos.
5. **NextZone Branding**: Maintain `NextZone Movies` top headers, `1080p Full HD` badges, and sleek modern custom video controls across all viewports.


