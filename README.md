# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Resolving merge conflicts in this project

When Git reports conflicts in files such as `src/App.jsx` or `src/pages/HomePage.jsx`, follow these steps to get back to a clean working tree:

1. **Update your local branch**
   ```bash
   git fetch origin
   git checkout your-feature-branch
   git merge origin/main
   ```
   Git will pause the merge if conflicting edits exist.

2. **Open each conflicted file** and look for markers like `<<<<<<<`, `=======`, and `>>>>>>>`. Decide which parts from each side you want to keep and edit the file until the markers disappear. Use the latest version of the bilingual components from this branch as the source of truth when unsure.

3. **Mark the conflicts as resolved** once the files look correct.
   ```bash
   git add src/App.jsx src/components/Header.jsx src/data/menuData.js src/pages/CategoryPage.jsx src/pages/HomePage.jsx
   ```

4. **Complete the merge** by committing the resolution.
   ```bash
   git commit
   ```

5. **Verify the app still builds** before pushing.
   ```bash
   npm install
   npm run build
   ```

If you prefer to discard your local changes and take the version from this branch, you can replace a conflicted file with the current one using:
```bash
git checkout --theirs path/to/file
```
and then run `git add` on it. Repeat for every file you want to overwrite. After resolving all files, run `git status` to ensure no conflicts remain, then create the merge commit.

