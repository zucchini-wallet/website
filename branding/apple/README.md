# Apple icon source

`Zucchini.icon` was created in Apple Icon Composer (Xcode 26.3). It contains the transparent mascot foreground, opaque forest-green fill (#111A14), opaque foreground group and subtle neutral shadow. Apple applies platform shape and Liquid Glass rendering.

The source is copied to `apple/Apps/Shared/AppIcon.icon` and included in both iOS and macOS app targets as a resource. AppIcon remains the configured app-icon name. Both platform asset compilations pass with the existing catalogs present.

`zucchini-macos-rounded-1024.png` was exported from Icon Composer using **macOS pre-Tahoe / Default / 1024pt / 1x**. `branding/export.cjs` derives the legacy Mac iconset from this export; `branding/layouts.cjs` packs the matching ICNS. Do not use the square mobile master for legacy Mac icon slots.

After editing the source in Icon Composer, re-export that PNG, run the branding exporters, and sync the source to the Apple repo. Native apps need a new build to show the updated icon.
