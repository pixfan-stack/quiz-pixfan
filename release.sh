#!/bin/bash
# Automated release script for Quiz PixFan
# Usage: ./release.sh [major|minor|patch]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Default bump type
BUMP_TYPE="${1:-patch}"

# Validate bump type
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo -e "${RED}Error: Invalid bump type. Use: major, minor, or patch${NC}"
  exit 1
fi

echo -e "${GREEN}🚀 Quiz PixFan Release Automation${NC}"
echo "=================================="
echo ""

# Step 1: Ensure clean working directory
echo -e "${YELLOW}Step 1: Checking working directory...${NC}"
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}Error: Working directory is not clean. Please commit or stash changes first.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Working directory is clean${NC}"
echo ""

# Step 2: Pull latest changes
echo -e "${YELLOW}Step 2: Pulling latest changes...${NC}"
git pull origin main
echo -e "${GREEN}✓ Latest changes pulled${NC}"
echo ""

# Step 3: Run tests
echo -e "${YELLOW}Step 3: Running tests...${NC}"
npm run typecheck
npm test
echo -e "${GREEN}✓ All tests passed${NC}"
echo ""

# Step 4: Calculate new version
echo -e "${YELLOW}Step 4: Calculating new version...${NC}"
CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case $BUMP_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo -e "${GREEN}New version: v${NEW_VERSION}${NC} (from v${CURRENT_VERSION})"
echo ""

# Step 5: Update package.json version
echo -e "${YELLOW}Step 5: Updating package.json...${NC}"
node -e "
  const pkg = require('./package.json');
  pkg.version = '${NEW_VERSION}';
  require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
echo -e "${GREEN}✓ Package version updated${NC}"
echo ""

# Step 6: Commit version bump
echo -e "${YELLOW}Step 6: Committing version bump...${NC}"
git add package.json
git commit -m "chore: bump version to v${NEW_VERSION}"
echo -e "${GREEN}✓ Version bump committed${NC}"
echo ""

# Step 7: Create and push tag
echo -e "${YELLOW}Step 7: Creating release tag...${NC}"
git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}"
git push origin main --tags
echo -e "${GREEN}✓ Tag pushed to remote${NC}"
echo ""

# Step 8: Summary
echo -e "${GREEN}🎉 Release v${NEW_VERSION} created successfully!${NC}"
echo ""
echo "What happens next:"
echo "  1. GitHub Actions will run CI/CD pipeline"
echo "  2. Tests will run automatically"
echo "  3. If tests pass, app will deploy to Cloudflare Pages"
echo "  4. A GitHub Release will be created"
echo ""
echo "Monitor progress at: https://github.com/${GITHUB_REPOSITORY:-your-org/quiz-pixfan}/actions"
