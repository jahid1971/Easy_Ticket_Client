````markdown
Project index snapshot

This folder contains JSON snapshots of the repository layout to reuse across sessions.

Files:
- `project-index.json` — serialized index of the project tree.
- `project-index-compact.json` — compact per-file summaries for quick lookup.

How to reuse in another session or machine

1. Copy the `project-index*.json` files to your new workspace root.

2. Load them in Node/TS or any script to inspect the project structure. Example Node snippet:

```js
const fs = require('fs');
const path = require('path');

const index = JSON.parse(fs.readFileSync(path.join(__dirname, 'project-index.json'), 'utf8'));
console.log(JSON.stringify(index, null, 2));
```

3. Use the compact index for quick file-to-purpose mapping and the full index for a structural snapshot.

Notes

- This snapshot reflects the structure as scanned on Aug 29, 2025.
- It does not contain file contents, only the tree and key filenames.
- If you change the repo layout, update the JSON files by re-running the index generation or editing by hand.

If you want, I can regenerate the index from the current workspace and include exact file lists per-folder (this requires running a local script).
````
