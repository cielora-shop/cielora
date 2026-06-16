const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src/components/navbar/index.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// The tabs we want to target for mapping mega menu links
const tabCategories = {
  "Bracelets": "/bracelets",
  "Earrings": "/earrings",
  "Necklaces": "/necklaces",
  "Rings": "/rings",
  "Charms": "/charms",
  "For him": "/for-him",
  "Outlet": "/outlet",
  "Shop by": "/shop-by",
  "Collections": "/collections"
};

for (const [tabName, route] of Object.entries(tabCategories)) {
  // Regex to find the block for the specific tab
  const tabRegex = new RegExp(`if \\(tab\\.name === "${tabName}"\\) \\{[\\s\\S]*?return \\([\\s\\S]*?\\);\\s*\\}`, 'g');
  
  navbarContent = navbarContent.replace(tabRegex, (tabBlock) => {
    // Within this block, replace <Link href="#" ...>Text</Link> with <Link href={\`${route}?filter=Text\`} ...>Text</Link>
    return tabBlock.replace(/<Link\s+href="#"([^>]*)>([^<]+)<\/Link>/g, (match, attrs, text) => {
      // Don't modify if it's not a generic mega menu link or we don't have text
      if (!text || text.includes("<")) return match;
      
      const param = encodeURIComponent(text.trim());
      return `<Link href={\`${route}?filter=${param}\`}${attrs}>${text}</Link>`;
    });
  });
}

fs.writeFileSync(navbarPath, navbarContent);
console.log("Navbar updated successfully.");
