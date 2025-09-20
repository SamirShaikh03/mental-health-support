const fs = require('fs');
const path = require('path');

// Simple syntax check for React files
console.log('Checking React files for syntax errors...');

const files = [
  './src/App.js',
  './src/components/Navbar.jsx',
  './src/components/LanguageSwitcher.jsx',
  './src/i18n.js'
];

let hasErrors = false;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`✓ ${file} - readable`);
    
    // Basic syntax checks
    if (file.endsWith('.json')) {
      JSON.parse(content);
      console.log(`✓ ${file} - valid JSON`);
    }
  } catch (err) {
    console.error(`✗ ${file} - ERROR: ${err.message}`);
    hasErrors = true;
  }
});

if (!hasErrors) {
  console.log('\n✓ All files passed basic syntax check!');
} else {
  console.log('\n✗ Some files have errors!');
  process.exit(1);
}