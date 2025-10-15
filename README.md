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

### Why conflicts still appear even with the same code

Git decides whether two files conflict based on the **history of the commits**, not only the resulting content. If you and another branch both edited the same file (even if you ultimately typed in the same code), Git will pause the merge so you can confirm which version to keep. That is why you may see conflict markers when pulling the changes from this repository, even though the files look identical to what you already have locally.

Most code editors offer quick buttons such as **“Accept Incoming Change”**, **“Accept Current Change”**, or **“Accept Both”**. Use these depending on what you want the final file to contain:

- Choose **Accept Incoming Change** when you want to keep the version from this branch (the one that already includes the multilingual menu and checkout updates).
- Choose **Accept Current Change** when your local edits should replace the incoming ones.
- Choose **Accept Both** or edit manually if you need to combine parts of each version.

After choosing an option for every conflict marker, review the file to ensure it matches the expected content, then save and stage it (`git add path/to/file`).

> **Tip:** If you accidentally click the wrong button, you can always undo the change in your editor or reset the file with `git checkout -- path/to/file` before staging it.

