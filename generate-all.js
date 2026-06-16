const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src/app/bracelets/page.tsx');
let baseContent = fs.readFileSync(srcPath, 'utf8');

const pagesToGenerate = [
  {
    folder: 'necklaces',
    component: 'Necklaces',
    title: 'Necklaces for women',
    breadcrumb: 'Necklaces',
    options: [
      "Silver Necklaces", "Gold Necklaces", "Leather Necklaces", "Pearl Necklaces", 
      "Chain Necklaces", "Multi Strand Necklaces", "Long Necklaces", "Short Necklaces", "Beaded Necklaces", 
      "Pendant Necklaces", "Heart-Shaped Necklaces", "Charm Necklaces", "Necklaces for Special Occasions", "Best Selling Necklaces"
    ]
  },
  {
    folder: 'rings',
    component: 'Rings',
    title: 'Rings for women',
    breadcrumb: 'Rings',
    options: [
      "Silver Rings", "Gold Rings", "Crystal Rings", 
      "Minimal Rings", "Rings for Special Occasions", "Best Selling Rings"
    ]
  },
  {
    folder: 'charms',
    component: 'Charms',
    title: 'Charms',
    breadcrumb: 'Charms',
    options: [
      "Silver Charms", "Gold Charms", "Gemstone Charms", 
      "Zodiac Charms", "Initial Charms", "Hoop Charms", "Heart-shaped charms"
    ]
  },
  {
    folder: 'for-him',
    component: 'ForHim',
    title: 'Jewelry for Him',
    breadcrumb: 'For Him',
    options: [
      "Bracelets for men", "Silver bracelets for men", "Leather bracelets for men", "Chain and Link bracelets", 
      "Rings for men", "Necklaces for men", "Watches", "Keychains", "Men's Best Sellers"
    ]
  },
  {
    folder: 'outlet',
    component: 'Outlet',
    title: 'Outlet',
    breadcrumb: 'Outlet',
    options: [
      "Outlet Bracelets", "Outlet Rings", "Outlet Earrings", "Outlet Necklaces", "Outlet Charms"
    ]
  }
];

pagesToGenerate.forEach(page => {
  const destPath = path.join(__dirname, 'src/app', page.folder, 'page.tsx');
  
  let content = baseContent;
  
  // Replace component names
  content = content.replace(/BraceletsContent/g, `${page.component}Content`);
  content = content.replace(/BraceletsPage/g, `${page.component}Page`);

  // Replace Title
  content = content.replace(/>\s*Bracelets for women\s*<\/h1>/g, `>\n          ${page.title}\n        </h1>`);

  // Replace Breadcrumb
  content = content.replace(/<span className="text-black">Bracelets<\/span>/g, `<span className="text-black">${page.breadcrumb}</span>`);

  // Replace topFilters
  const topFiltersStr = `const topFilters = [\n    ${page.options.map(o => `"${o}"`).join(', ')}\n  ];`;
  content = content.replace(/const topFilters = \[[^\]]+\];/g, topFiltersStr);

  // Replace categories
  const categoriesStr = `const categories = [\n${page.options.map(o => `    { name: "${o}", count: 0 }`).join(',\n')}\n  ];`;
  content = content.replace(/const categories = \[[^\]]+\];/g, categoriesStr);

  // Replace categoryOptions
  const categoryOptionsStr = `const categoryOptions = [${page.options.map(o => `"${o}"`).join(', ')}];`;
  content = content.replace(/const categoryOptions = \[[^\]]+\];/g, categoryOptionsStr);

  // Make sure the destination folder exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.writeFileSync(destPath, content);
  console.log(`Generated ${page.folder} page.`);
});
