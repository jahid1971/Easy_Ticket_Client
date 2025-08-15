Project index snapshot

This folder contains a JSON snapshot of the repository layout to reuse across sessions.

Files:
- `project-index.json` — serialized index of the project tree.

How to reuse in another session or machine

1. Copy `project-index.json` to your new workspace root.

2. Load it in Node/TS or any script to inspect the project structure. Example Node snippet:

```js
const fs = require('fs');
const path = require('path');

const index = JSON.parse(fs.readFileSync(path.join(__dirname, 'project-index.json'), 'utf8'));
console.log(JSON.stringify(index, null, 2));
```

3. Use the file to quickly locate files or to seed tooling that needs a project map.

Notes

- This snapshot reflects the structure as scanned on Aug 25, 2025 during an indexing operation.
- It does not contain file contents, only the tree and key filenames.
- If you change the repo layout, re-run the index scan in the original environment or update the JSON by hand.
