# Zucchini branding

## Approved direction

The **golden illustrated mascot on deep forest green (#111A14)** is the approved primary identity. Use the close-up artwork for app icons and avatars, and the matching uncropped transparent character for the website hero and wordmark. Keep the capsule eyes, subtle cheeks, and mouthless expression consistent.

The previous smooth 3D logo is retained in `masters/alternate/3d-original/`; the Zcash-sticker mark remains an alternate. Neither is the default app icon.

- `masters/primary/zucchini-mark.png`: transparent approved symbol.
- `masters/primary/zucchini-app-icon.png`: opaque dark-background app artwork.
- `masters/alternate/zucchini-zcash-mark.png`: transparent alternate with Zcash sticker.
- `concepts/`: original proposals and generation prompts.

## Export library

- `extension/`: square mascot PNGs at 16, 24, 32, 48, 64, 128, 256 and 512 px.
- `mobile/ios/`: opaque square PNG exports, including 1024 px store artwork.
- `mobile/android/`: legacy density sizes and 512 px store artwork. Adaptive icon layers require integration with the app's platform asset configuration.
- `desktop/`: 16–1024 px PNGs, Windows ICO, macOS ICNS and iconset source.
- `social/`: avatars at 256, 400, 512 and 1024 px; 1200 × 630 sharing card.
- `banners/`: 1500 × 500 social header and 1920 × 640 wide banner.
- `website/`: transparent mark, favicons, touch icon and sharing card.

All dimensions are pixels. Platform corner masks are applied by the platform, not baked into the opaque masters. Use the close-up mascot at tiny icon sizes. Do not add the Zcash badge to default app icons. The master PNGs are 1254 × 1254 raster illustrations, not editable 3D models or vector artwork.

## Reproduction

Run `node branding/export.cjs`, `node branding/layouts.cjs`, and `node scripts/render-social-card.cjs` with Sharp installed (or SHARP_MODULE pointing to an existing installation). `exports.json` lists core PNG outputs. Copy the generated sharing card to social/ and website/ after regeneration.

Exports are prepared here; extension/mobile/desktop application repositories have not been changed. Their manifests and platform catalogs must reference these files when integrated.
