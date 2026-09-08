.PHONY: help dev build test test-unit test-integration test-e2e test-coverage lint format clean install deps docker-up docker-down docker-build logs migrate migrate-up migrate-down db-seed deploy

# ================================================================================
# MAKEFILE - Development & Production Commands for Agentic Restaurant Chatbot
# ================================================================================

.DEFAULT_GOAL := help

COLOR_RESET := \033[0m
COLOR_BOLD := \033[1m
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_BLUE := \033[34m

help: ## Show this help message
	@echo "$(COLOR_BLUE)╔════════════════════════════════════════════════════════════════╗$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)║  Agentic Restaurant Chatbot - Development Commands              ║$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)╚════════════════════════════════════════════════════════════════╝$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_BOLD)Development:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make dev$(COLOR_RESET)              Start all services (API + AI + Frontend)"
	@echo "  $(COLOR_GREEN)make install$(COLOR_RESET)          Install all dependencies"
	@echo "  $(COLOR_GREEN)make lint$(COLOR_RESET)             Run linters (ESLint + Pylint)"
	@echo "  $(COLOR_GREEN)make format$(COLOR_RESET)           Format code (Prettier + Black)"
	@echo ""
	@echo "$(COLOR_BOLD)Testing:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make test$(COLOR_RESET)             Run all tests"
	@echo "  $(COLOR_GREEN)make test-unit$(COLOR_RESET)        Run unit tests only"
	@echo "  $(COLOR_GREEN)make test-integration$(COLOR_RESET)  Run integration tests"
	@echo "  $(COLOR_GREEN)make test-e2e$(COLOR_RESET)         Run end-to-end tests"
	@echo "  $(COLOR_GREEN)make test-coverage$(COLOR_RESET)    Generate coverage report"
	@echo ""
	@echo "$(COLOR_BOLD)Database:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make db-migrate$(COLOR_RESET)       Run pending migrations"
	@echo "  $(COLOR_GREEN)make db-rollback$(COLOR_RESET)      Rollback last migration"
	@echo "  $(COLOR_GREEN)make db-seed$(COLOR_RESET)          Seed sample data"
	@echo "  $(COLOR_GREEN)make db-reset$(COLOR_RESET)         Reset database (⚠️  DESTRUCTIVE)"
	@echo ""
	@echo "$(COLOR_BOLD)Docker:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make docker-build$(COLOR_RESET)     Build Docker images"
	@echo "  $(COLOR_GREEN)make docker-up$(COLOR_RESET)        Start Docker containers"
	@echo "  $(COLOR_GREEN)make docker-down$(COLOR_RESET)      Stop Docker containers"
	@echo "  $(COLOR_GREEN)make docker-logs$(COLOR_RESET)      View Docker logs"
	@echo ""
	@echo "$(COLOR_BOLD)Production:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make build$(COLOR_RESET)            Build for production"
	@echo "  $(COLOR_GREEN)make deploy$(COLOR_RESET)           Deploy to GCP (requires credentials)"
	@echo "  $(COLOR_GREEN)make logs$(COLOR_RESET)             View production logs"
	@echo ""
	@echo "$(COLOR_BOLD)Utilities:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make clean$(COLOR_RESET)            Clean build artifacts"
	@echo "  $(COLOR_GREEN)make help$(COLOR_RESET)             Show this help message"
	@echo ""

# ================================================================================
# DEVELOPMENT COMMANDS
# ================================================================================

install: ## Install all dependencies (Node + Python)
	@echo "$(COLOR_YELLOW)Installing dependencies...$(COLOR_RESET)"
	pnpm install
	cd services/ai && pip install -r requirements.txt && cd ../..
	@echo "$(COLOR_GREEN)✓ Dependencies installed$(COLOR_RESET)"

deps: install ## Alias for install

dev: ## Start all services locally
	@echo "$(COLOR_YELLOW)Starting development environment...$(COLOR_RESET)"
	pnpm run dev

lint: ## Run linters
	@echo "$(COLOR_YELLOW)Running linters...$(COLOR_RESET)"
	pnpm run lint
	@echo "$(COLOR_GREEN)✓ Linting complete$(COLOR_RESET)"

format: ## Format code
	@echo "$(COLOR_YELLOW)Formatting code...$(COLOR_RESET)"
	pnpm run format
	cd services/ai && python -m black app tests && cd ../..
	@echo "$(COLOR_GREEN)✓ Code formatted$(COLOR_RESET)"

clean: ## Clean build artifacts
	@echo "$(COLOR_YELLOW)Cleaning build artifacts...$(COLOR_RESET)"
	rm -rf dist build __pycache__ .coverage .pytest_cache node_modules
	pnpm run clean
	@echo "$(COLOR_GREEN)✓ Cleaned$(COLOR_RESET)"

# ================================================================================
# TESTING COMMANDS
# ================================================================================

test: ## Run all tests
	@echo "$(COLOR_YELLOW)Running all tests...$(COLOR_RESET)"
	pnpm run test

test-unit: ## Run unit tests only
	@echo "$(COLOR_YELLOW)Running unit tests...$(COLOR_RESET)"
	pnpm run test --testPathPattern="unit"
	cd services/ai && pytest tests/unit && cd ../..

test-integration: ## Run integration tests
	@echo "$(COLOR_YELLOW)Running integration tests...$(COLOR_RESET)"
	pnpm run test --testPathPattern="integration"
	cd services/ai && pytest tests/integration && cd ../..

test-e2e: ## Run end-to-end tests
	@echo "$(COLOR_YELLOW)Running E2E tests...$(COLOR_RESET)"
	pnpm run test:e2e

test-coverage: ## Generate test coverage report
	@echo "$(COLOR_YELLOW)Generating coverage report...$(COLOR_RESET)"
	pnpm run test:coverage
	@echo "$(COLOR_GREEN)✓ Coverage report generated in ./coverage$(COLOR_RESET)"

# ================================================================================
# DATABASE COMMANDS
# ================================================================================

db-migrate: ## Run pending database migrations
	@echo "$(COLOR_YELLOW)Running migrations...$(COLOR_RESET)"
	cd database && python migrate.py up && cd ..
	@echo "$(COLOR_GREEN)✓ Migrations complete$(COLOR_RESET)"

db-rollback: ## Rollback last migration
	@echo "$(COLOR_YELLOW)Rolling back...$(COLOR_RESET)"
	cd database && python migrate.py down && cd ..
	@echo "$(COLOR_GREEN)✓ Rollback complete$(COLOR_RESET)"

db-seed: ## Seed sample data
	@echo "$(COLOR_YELLOW)Seeding sample data...$(COLOR_RESET)"
	cd database && python seed.py && cd ..
	@echo "$(COLOR_GREEN)✓ Data seeded$(COLOR_RESET)"

db-reset: ## Reset database (DESTRUCTIVE!)
	@echo "$(COLOR_YELLOW)⚠️  Resetting database...$(COLOR_RESET)"
	@read -p "Are you sure? Type 'yes' to confirm: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		cd database && python migrate.py down-all && python migrate.py up && python seed.py && cd ..; \
		echo "$(COLOR_GREEN)✓ Database reset$(COLOR_RESET)"; \
	else \
		echo "Cancelled"; \
	fi

# ================================================================================
# DOCKER COMMANDS
# ================================================================================

docker-build: ## Build Docker images
	@echo "$(COLOR_YELLOW)Building Docker images...$(COLOR_RESET)"
	docker-compose build
	@echo "$(COLOR_GREEN)✓ Docker images built$(COLOR_RESET)"

docker-up: ## Start Docker containers
	@echo "$(COLOR_YELLOW)Starting Docker containers...$(COLOR_RESET)"
	docker-compose up -d
	@echo "$(COLOR_GREEN)✓ Containers started$(COLOR_RESET)"
	@echo "  API:       http://localhost:5000"
	@echo "  AI:        http://localhost:8000"
	@echo "  Frontend:  http://localhost:5173"

docker-down: ## Stop Docker containers
	@echo "$(COLOR_YELLOW)Stopping Docker containers...$(COLOR_RESET)"
	docker-compose down
	@echo "$(COLOR_GREEN)✓ Containers stopped$(COLOR_RESET)"

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-rebuild: docker-down docker-build docker-up ## Rebuild and restart all containers
	@echo "$(COLOR_GREEN)✓ Containers rebuilt and restarted$(COLOR_RESET)"

# ================================================================================
# BUILD & DEPLOYMENT
# ================================================================================

build: clean lint test ## Build for production
	@echo "$(COLOR_YELLOW)Building for production...$(COLOR_RESET)"
	pnpm run build
	@echo "$(COLOR_GREEN)✓ Production build complete$(COLOR_RESET)"

deploy: build ## Deploy to GCP (requires credentials)
	@echo "$(COLOR_YELLOW)Deploying to Google Cloud Platform...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)This requires:$(COLOR_RESET)"
	@echo "  - gcloud CLI installed and authenticated"
	@echo "  - GCP credentials configured"
	@echo "$(COLOR_YELLOW)Running deployment...$(COLOR_RESET)"
	./scripts/deploy.sh
	@echo "$(COLOR_GREEN)✓ Deployment complete$(COLOR_RESET)"

logs: ## View production logs
	@echo "$(COLOR_YELLOW)Viewing production logs...$(COLOR_RESET)"
	gcloud app logs read

# ================================================================================
# SETUP & INIT
# ================================================================================

init: install db-migrate db-seed ## Initialize project (install + migrate + seed)
	@echo "$(COLOR_GREEN)✓ Project initialized$(COLOR_RESET)"

setup: ## Run complete setup (same as scripts/setup.sh)
	@chmod +x scripts/setup.sh
	./scripts/setup.sh

.PHONY: all
all: help
