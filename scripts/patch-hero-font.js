const fs = require("fs");
const path = require("path");

const heroTextPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "heroui-native",
  "lib",
  "module",
  "helpers",
  "internal",
  "components",
  "hero-text.js"
);

const content = fs.readFileSync(heroTextPath, "utf-8");
const patched = content.includes("font-sans");

if (!patched) {
  const updated = content.replace(
    "cn('font-normal', className)",
    "cn('font-sans font-normal', className)"
  );
  fs.writeFileSync(heroTextPath, updated, "utf-8");
  console.log("✅ HeroText patched: font-sans added");
} else {
  console.log("✅ HeroText already patched");
}
