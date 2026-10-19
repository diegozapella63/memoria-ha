// Build: cd frontend && npm install && npm run build
// Outputs:
//   memoria/rootfs/app/www/memoria.js   UI served by the app (+ www/fonts/)
//   preview/memoria-preview.html        self-contained preview with sample notebooks
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const common = {
  bundle: true,
  minify: true,
  legalComments: "none",
  loader: { ".woff2": "dataurl" },
  target: ["chrome100", "safari15", "firefox100"],
  logLevel: "warning",
  format: "iife",
  // Lit prints a "loaded from a bundle" notice unless this is set first.
  banner: {
    js: "/* MemorIA · Lit (BSD-3), Lucide icons (ISC), Barlow, Barlow Condensed & Caveat (OFL) */\nwindow.litDisableBundleWarning=true;",
  },
};

// The app serves the font files itself (www/fonts/), so they are cached and
// work offline.
rmSync(resolve(root, "memoria/rootfs/app/www/fonts"), { recursive: true, force: true });
await build({
  ...common,
  entryPoints: [resolve(here, "src/main.js")],
  outfile: resolve(root, "memoria/rootfs/app/www/memoria.js"),
  loader: { ".woff2": "file" },
  assetNames: "fonts/[name]",
  publicPath: "./",
});

// The preview is a single file, so fonts are inlined there.
const out = await build({ ...common, entryPoints: [resolve(here, "preview/preview.js")], write: false });
const js = out.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const shell = readFileSync(resolve(here, "preview/preview.template.html"), "utf8");
mkdirSync(resolve(root, "preview"), { recursive: true });
writeFileSync(resolve(root, "preview/memoria-preview.html"), shell.replace("/*BUNDLE*/", () => js));
console.log("built");
