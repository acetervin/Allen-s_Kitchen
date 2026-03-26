const fs = require('fs');
const path = require('path');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
}

async function main() {
  const root = process.cwd();
  const dist = path.join(root, 'dist');
  await ensureDir(dist);

  // Copy and rewrite index.html to reference styles.css at root of dist
  const indexPath = path.join(root, 'index.html');
  try {
    let html = await fs.promises.readFile(indexPath, 'utf8');
    html = html.replace(/href="dist\/styles.css"/g, 'href="styles.css"');
    // Ensure src/ paths are preserved for src/components files
    await fs.promises.writeFile(path.join(dist, 'index.html'), html, 'utf8');
    console.log('Copied index.html → dist/index.html');
  } catch (err) {
    console.error('Failed to copy index.html:', err.message);
  }

  // Copy script.js
  try {
    await copyFile(path.join(root, 'script.js'), path.join(dist, 'script.js'));
    console.log('Copied script.js → dist/script.js');
  } catch (err) {
    console.error('Failed to copy script.js:', err.message);
  }

  // Copy src/components directory (loading screen files)
  const componentsDir = path.join(root, 'src', 'components');
  try {
    const files = await fs.promises.readdir(componentsDir);
    for (const file of files) {
      const src = path.join(componentsDir, file);
      const dest = path.join(dist, 'src', 'components', file);
      await copyFile(src, dest);
      console.log(`Copied ${file} → dist/src/components/${file}`);
    }
  } catch (err) {
    console.error('Failed to copy components:', err.message);
  }

  // Copy top-level image assets
  const files = await fs.promises.readdir(root);
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (exts.includes(ext)) {
      try {
        await copyFile(path.join(root, f), path.join(dist, f));
        console.log(`Copied ${f} → dist/${f}`);
      } catch (err) {
        console.error(`Failed to copy ${f}:`, err.message);
      }
    }
  }

  console.log('prepare-dist complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
