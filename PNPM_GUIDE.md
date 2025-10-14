# PNPM Migration Guide

## ✅ Migration Complete!

Your NX workspace is now configured to use **pnpm** as the package manager with **single package management** (monorepo-wide dependency management).

## 🎯 What Changed

### 1. Package Manager
- ✅ Switched from `npm` to `pnpm`
- ✅ Created `.npmrc` for pnpm configuration
- ✅ Created `pnpm-workspace.yaml` for workspace definition
- ✅ Updated `nx.json` to specify pnpm as the package manager

### 2. Single Package Management
- ✅ All dependencies managed at root level
- ✅ Single `package.json` at workspace root
- ✅ Shared `node_modules` across all apps and libraries
- ✅ Consistent versions across the entire monorepo

## 📦 PNPM Configuration

### `.npmrc`
```ini
shamefully-hoist=true        # Hoist dependencies for better compatibility
strict-peer-dependencies=false  # Don't fail on peer dependency issues
auto-install-peers=true      # Automatically install peer dependencies
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'libs/*'
```

## 🚀 Updated Commands

### Installation
```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name
```

### Development
```bash
# Serve shell app
pnpm exec nx serve shell

# Serve with dev remotes (hot reload)
pnpm exec nx serve shell --devRemotes=newInstructionsUi

# Or use the shorthand
pnpm nx serve shell --devRemotes=newInstructionsUi
```

### Build
```bash
# Build all apps
pnpm nx run-many -t build

# Build specific app
pnpm nx build shell
pnpm nx build newInstructionsUi
```

### Testing & Linting
```bash
# Run tests
pnpm nx test shell

# Run linting
pnpm nx lint shell

# Fix linting issues
pnpm nx lint shell --fix
```

### Workspace Commands
```bash
# View dependency graph
pnpm nx graph

# Show project details
pnpm nx show project shell

# List all projects
pnpm nx list

# Clear cache
pnpm nx reset
```

## 🎨 Benefits of PNPM

### 1. **Disk Space Efficiency**
- Content-addressable storage (saves disk space)
- Hard links instead of copying files
- Single global store for all projects

### 2. **Speed**
- Parallel installation
- Faster than npm and yarn
- Efficient caching

### 3. **Strict Dependency Resolution**
- Non-flat node_modules by default
- Prevents phantom dependencies
- Better security

### 4. **Workspace Support**
- Native monorepo support
- Clean dependency isolation
- Efficient shared dependencies

## 📊 Single Package Management Benefits

### ✅ Advantages
1. **Version Consistency**: One version of each package across the entire monorepo
2. **Simplified Updates**: Update dependencies once, affect all apps
3. **Easier Maintenance**: Single `package.json` to manage
4. **Faster Installs**: Shared dependencies, no duplication
5. **Better Module Federation**: Consistent versions for shared libraries

### ⚠️ Considerations
- All apps share the same dependency versions
- Breaking changes affect all apps simultaneously
- Need coordination when updating major versions

## 🔧 Common PNPM Commands

### Dependency Management
```bash
# Install all dependencies
pnpm install

# Update all dependencies
pnpm update

# Update specific dependency
pnpm update package-name

# Interactive update
pnpm update -i

# Check outdated packages
pnpm outdated

# Audit dependencies
pnpm audit
```

### Workspace Operations
```bash
# Run command in all packages
pnpm -r run build

# Run command in specific workspace
pnpm --filter shell run build

# Add dependency to specific workspace (if needed)
pnpm --filter shell add package-name
```

## 🐛 Troubleshooting

### Clear Everything and Reinstall
```bash
rm -rf node_modules pnpm-lock.yaml .nx/cache
pnpm install
```

### Peer Dependency Warnings
Already handled in `.npmrc` with:
- `strict-peer-dependencies=false`
- `auto-install-peers=true`

### Build Scripts Warning
If you see build script warnings, approve them:
```bash
pnpm approve-builds
```

Or allow specific packages:
```bash
pnpm approve-builds @swc/core nx
```

### Module Not Found Errors
Try hoisting the problematic package:
```bash
# Already enabled in .npmrc
shamefully-hoist=true
```

## 📝 NX + PNPM Integration

NX is fully compatible with pnpm and will automatically:
- Use `pnpm` for all operations when configured
- Respect `pnpm-workspace.yaml`
- Cache build artifacts efficiently
- Share dependencies across projects

## 🔄 Migration from npm Scripts

If you have npm scripts in `package.json`, they work the same:

```json
{
  "scripts": {
    "start": "nx serve shell",
    "build": "nx build shell",
    "test": "nx test"
  }
}
```

Run them with:
```bash
pnpm start
pnpm build
pnpm test
```

## ✨ Quick Reference

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Add package | `pnpm add package-name` |
| Remove package | `pnpm remove package-name` |
| Update packages | `pnpm update` |
| Run NX command | `pnpm nx <command>` |
| Serve app | `pnpm nx serve shell` |
| Build app | `pnpm nx build shell` |
| Test app | `pnpm nx test shell` |
| Lint app | `pnpm nx lint shell` |
| View graph | `pnpm nx graph` |

## 🎯 Next Steps

1. Update your CI/CD pipelines to use `pnpm`
2. Configure IDE to use `pnpm` (if needed)
3. Update documentation for your team
4. Consider adding pnpm scripts to `package.json`

## 📚 Resources

- [PNPM Documentation](https://pnpm.io/)
- [NX with PNPM](https://nx.dev/recipes/adopting-nx/pnpm-workspace)
- [PNPM Workspace](https://pnpm.io/workspaces)

---

**Your workspace is now optimized with PNPM! 🚀**
