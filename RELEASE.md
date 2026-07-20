# Quiz PixFan

## 📦 Versioning & Releases

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR** — Breaking changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes

### Automated Release Process

```bash
# Patch release (default)
./release.sh

# Minor release
./release.sh minor

# Major release
./release.sh major
```

### Manual Release

```bash
# 1. Ensure working directory is clean
git status

# 2. Run all tests
npm run typecheck
npm test

# 3. Bump version
npm version patch  # or minor/major

# 4. Push
git push origin main --tags
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/ci-cd.yml` pipeline runs:

1. **Lint & Type Check** — TypeScript compilation
2. **Unit Tests** — Vitest (54 tests)
3. **E2E Tests** — Playwright (21 tests)
4. **Build** — Vite production build
5. **Deploy** — Cloudflare Pages (main branch only)

### Required Secrets

Add these to your GitHub repository settings:

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages & D1 access

### Manual Deployment

```bash
# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=quiz-pixfan
```

## 📋 Pre-release Checklist

- [ ] All tests passing (`npm test`)
- [ ] E2E tests passing (`npx playwright test`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changelog updated
- [ ] README.md updated if needed
- [ ] Version bumped in package.json
