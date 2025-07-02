const fs = require('fs');
const path = require('path');

// Path to the icons.json file
const jsonFilePath = path.join(__dirname, 'icons.json');

// Output directory for individual icon SVG files
const outputDir = path.join(__dirname, 'icons');

// SVG wrapper (prefix and suffix)
const ICON_PREFIX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">`;
const ICON_SUFFIX = `</svg>`;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Read and parse the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading icons.json:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const icons = jsonData.icons;

    if (!icons || typeof icons !== 'object') {
      throw new Error('Invalid format: "icons" key is missing or not an object');
    }

    Object.entries(icons).forEach(([iconName, iconObj]) => {
      if (!iconObj.body) {
        console.warn(`Skipping ${iconName}: missing "body"`);
        return;
      }

      const finalSvg = `${ICON_PREFIX}${iconObj.body}${ICON_SUFFIX}`;
      const iconFilePath = path.join(outputDir, `${iconName}.svg`);

      fs.writeFile(iconFilePath, finalSvg, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing ${iconName}.svg:`, err);
        } else {
          console.log(`Saved: ${iconName}.svg`);
        }
      });
    });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
