# Git Hooks

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Pre-commit Hook

The pre-commit hook automatically runs linting on staged files before each commit using [lint-staged](https://github.com/okonet/lint-staged).

### What it does:
- Runs ESLint on all staged `.js`, `.jsx`, `.ts`, and `.tsx` files
- Automatically fixes linting errors where possible
- Prevents commits if there are unfixable linting errors

### Configuration

The lint-staged configuration is in `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix"
  ]
}
```

### Bypassing the hook (not recommended)

If you need to bypass the pre-commit hook for a specific commit:

```bash
git commit --no-verify -m "your message"
```

**Note:** This is not recommended as it defeats the purpose of maintaining code quality.
