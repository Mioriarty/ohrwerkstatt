# Formatting and Prettier

To enable consistent automatic formatting in VS Code:

- Install the Prettier extension (`esbenp.prettier-vscode`).
- Run `npm install` in the project root to install the local `prettier` devDependency (optional, useful for `npm run format`).
- Format on save is enabled in `.vscode/settings.json` (works when Prettier extension is installed).

CLI formatting:

```bash
# install deps
npm install

# format files
npm run format
```

Notes:

- The workspace includes `.prettierrc.json` with formatting preferences and `.prettierignore` to exclude generated files.
- If you prefer not to add a local dependency, the VS Code Prettier extension can format files without a local install, but behaviors may differ slightly.
