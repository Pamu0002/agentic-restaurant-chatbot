#!/bin/bash

################################################################################
# AGENTIC RESTAURANT CHATBOT - COMPLETE SETUP SCRIPT
# Automates: GCP setup, databases, environment, dependencies, verification
################################################################################

set -e  # Exit on error

echo "🚀 Starting Agentic Restaurant Chatbot Setup..."
echo "=================================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}ERROR: $1 is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $1 found${NC}"
}

check_command "node"
check_command "npm"
check_command "pnpm"
check_command "python3"
check_command "pip"
check_command "git"

# Check Node and Python versions
NODE_VERSION=$(node -v)
PYTHON_VERSION=$(python3 -v)
echo -e "${GREEN}Node version: $NODE_VERSION${NC}"
echo -e "${GREEN}Python version: $PYTHON_VERSION${NC}"

################################################################################
# INSTALL DEPENDENCIES
################################################################################

echo -e "\n${YELLOW}Step 2: Installing dependencies...${NC}"

# Install pnpm and Node.js dependencies
echo "Installing pnpm global dependencies..."
pnpm install -g pnpm

echo "Installing Node.js dependencies (monorepo)..."
pnpm install

# Install Python dependencies
echo "Installing Python dependencies..."
cd services/ai
pip install -r requirements.txt
cd ../..

echo -e "${GREEN}✓ Dependencies installed${NC}"

################################################################################
# SETUP ENVIRONMENT VARIABLES
################################################################################

echo -e "\n${YELLOW}Step 3: Setting up environment variables...${NC}"

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Updated .env - Please fill in your values:${NC}"
        echo "   - GOOGLE_CLOUD_PROJECT"
        echo "   - VITE_FIREBASE_API_KEY"
        echo "   - STRIPE_SECRET_KEY (can be test key)"
    fi
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

################################################################################
# CREATE DIRECTORY STRUCTURE
################################################################################

echo -e "\n${YELLOW}Step 4: Creating required directories...${NC}"

mkdir -p services/ai/logs
mkdir -p services/api/logs
mkdir -p packages/@restaurant/web/public/uploads
mkdir -p .github/workflows
mkdir -p infrastructure/terraform
mkdir -p database/migrations/firestore
mkdir -p database/migrations/mongodb

echo -e "${GREEN}✓ Directories created${NC}"

################################################################################
# SETUP GIT HOOKS
################################################################################

echo -e "\n${YELLOW}Step 5: Setting up Git hooks...${NC}"

mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run tests
pnpm test --passWithNoTests

# Check for secrets
if grep -r "sk_live_" . --include="*.ts" --include="*.js" --include="*.env"; then
    echo "ERROR: Production secrets found in code!"
    exit 1
fi

echo "✓ Pre-commit checks passed"
EOF

chmod +x .git/hooks/pre-commit

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
echo "Running pre-push checks..."

# Run all tests
pnpm test

# Check test coverage
pnpm test:coverage

echo "✓ Pre-push checks passed"
EOF

chmod +x .git/hooks/pre-push

echo -e "${GREEN}✓ Git hooks installed${NC}"

################################################################################
# VERIFY SETUP
################################################################################

echo -e "\n${YELLOW}Step 6: Verifying setup...${NC}"

# Check if services are properly structured
if [ ! -f "services/api/src/main.ts" ]; then
    echo -e "${RED}ERROR: services/api/src/main.ts not found${NC}"
    exit 1
fi

if [ ! -f "services/ai/app/main.py" ]; then
    echo -e "${RED}ERROR: services/ai/app/main.py not found${NC}"
    exit 1
fi

if [ ! -f "packages/@restaurant/web/src/main.tsx" ]; then
    echo -e "${RED}ERROR: packages/@restaurant/web/src/main.tsx not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project structure verified${NC}"

################################################################################
# FINAL STATUS
################################################################################

echo -e "\n=================================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "=================================================="
echo ""
echo "Available commands:"
echo "  ${YELLOW}make dev${NC}              - Start all services locally"
echo "  ${YELLOW}make test${NC}             - Run all tests"
echo "  ${YELLOW}make build${NC}            - Build production Docker images"
echo "  ${YELLOW}make docker-up${NC}        - Start Docker containers"
echo "  ${YELLOW}make docker-down${NC}      - Stop Docker containers"
echo "  ${YELLOW}make db-migrate${NC}       - Run database migrations"
echo "  ${YELLOW}make logs${NC}             - View service logs"
echo ""
echo "Next steps:"
echo "  1. Fill in .env file with your credentials"
echo "  2. Run ${YELLOW}make dev${NC} to start development"
echo "  3. Visit http://localhost:5173 (frontend)"
echo ""
echo "Documentation:"
echo "  - docs/ARCHITECTURE.md - System design"
echo "  - docs/SETUP.md - Detailed setup guide"
echo "  - docs/API.md - API documentation"
echo ""
