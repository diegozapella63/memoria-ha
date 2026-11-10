// The version lives only in memoria/config.yaml; the build (npm run build) writes it to lib/version.js and the preview.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { VERSION } from "../memoria/rootfs/app/lib/version.js";

test("the version of config.yaml is the one of the server and of the preview (run the build after changing it)", () => {
  const yaml = /^version:\s*"?([\d.]+)"?/m.exec(fs.readFileSync(new URL("../memoria/config.yaml", import.meta.url), "utf8"))[1];
  assert.equal(VERSION, yaml);
  assert.ok(fs.readFileSync(new URL("../preview/memoria-preview.html", import.meta.url), "utf8").includes(`"${yaml}"`));
  assert.match(fs.readFileSync(new URL("../memoria/CHANGELOG.md", import.meta.url), "utf8"), new RegExp(`^## ${yaml.replace(/\./g, "\\.")}$`, "m"));
});
