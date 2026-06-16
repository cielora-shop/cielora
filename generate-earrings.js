const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src/app/bracelets/page.tsx');
const destPath = path.join(__dirname, 'src/app/earrings/page.tsx');

let content = fs.readFileSync(srcPath, 'utf8');

// Replace component names
content = content.replace(/BraceletsContent/g, 'EarringsContent');
content = content.replace(/BraceletsPage/g, 'EarringsPage');

// Replace Title
content = content.replace(/>\s*Bracelets for women\s*<\/h1>/g, '>\n          Earrings for women\n        </h1>');

// Replace Breadcrumb
content = content.replace(/<span className="text-black">Bracelets<\/span>/g, '<span className="text-black">Earrings</span>');

// Mega menu items
const earringsOptions = [
  "Silver Earrings", "Gold Earrings", "Pearl Earrings", 
  "Hoop Earrings", "Drop Earrings", "Stud Earrings", "Single Earrings", 
  "Heart-Shaped Earrings", "Best selling earrings", "Earrings for Special Occasions"
];

// Replace topFilters
const topFiltersStr = `const topFilters = [\n    ${earringsOptions.map(o => `"${o}"`).join(', ')}\n  ];`;
content = content.replace(/const topFilters = \[[^\]]+\];/g, topFiltersStr);

// Replace categories
const categoriesStr = `const categories = [\n${earringsOptions.map(o => `    { name: "${o}", count: 0 }`).join(',\n')}\n  ];`;
content = content.replace(/const categories = \[[^\]]+\];/g, categoriesStr);

// Replace categoryOptions
const categoryOptionsStr = `const categoryOptions = [${earringsOptions.map(o => `"${o}"`).join(', ')}];`;
content = content.replace(/const categoryOptions = \[[^\]]+\];/g, categoryOptionsStr);

fs.writeFileSync(destPath, content);
console.log('Earrings page generated successfully!');
