const fs = require('fs');
const path = require('path');

const INDEX_FILE = path.join(__dirname, '..', 'project-index-compact.json');

function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error(`Index file not found: ${INDEX_FILE}`);
    process.exit(2);
  }

  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf8');
    const json = JSON.parse(raw);

    console.log('Loaded project-index-compact.json');
    console.log('Summary:', json.summary || 'no summary');
    console.log('Files indexed:', Object.keys(json.files || {}).length);

    // Optionally print top-level keys
    console.log('\nTop entries:');
    Object.entries(json.files || {}).slice(0, 20).forEach(([k, v]) => {
      console.log('-', k);
    });

    // Minimal export for other scripts
    return json;
  } catch (err) {
    console.error('Failed to read/parse index:', err.message || err);
    process.exit(3);
  }
}

if (require.main === module) {
  loadIndex();
}

module.exports = { loadIndex };
