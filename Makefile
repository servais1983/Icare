# ICARUS Project Makefile

.PHONY: all build test deploy clean security-scan

# Variables
PROJECT_NAME := icarus
VERSION := 0.1.0-alpha
BUILD_DIR := ./build
SRC_DIR := ./src

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m

# Default target
all: security-check build test

# Security pre-check
security-check:
	@echo "$(BLUE)Running security checks...$(NC)"
	@./scripts/security-check.sh

# Build all components
build: build-core build-aegis build-dashboard
	@echo "$(GREEN)Build complete!$(NC)"

build-core:
	@echo "$(BLUE)Building ICARUS Core...$(NC)"
	@cd $(SRC_DIR)/core && cargo build --release

build-aegis:
	@echo "$(BLUE)Building AEGIS Orchestrator...$(NC)"
	@cd $(SRC_DIR)/aegis && cargo build --release

build-dashboard:
	@echo "$(BLUE)Building Dashboard...$(NC)"
	@cd $(SRC_DIR)/dashboard && npm run build

# Run tests
test: test-unit test-integration test-security
	@echo "$(GREEN)All tests passed!$(NC)"

test-unit:
	@echo "$(BLUE)Running unit tests...$(NC)"
	@cargo test --all

test-integration:
	@echo "$(BLUE)Running integration tests...$(NC)"
	@./scripts/integration-test.sh

test-security:
	@echo "$(BLUE)Running security tests...$(NC)"
	@./scripts/security-test.sh

# Deploy
deploy: security-check
	@echo "$(YELLOW)Deploying ICARUS...$(NC)"
	@docker-compose up -d

# Development environment
dev:
	@echo "$(BLUE)Starting development environment...$(NC)"
	@docker-compose -f docker-compose.dev.yml up

# Clean build artifacts
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR)
	@cargo clean
	@cd $(SRC_DIR)/dashboard && rm -rf node_modules dist

# Security scanning
security-scan:
	@echo "$(BLUE)Running security scan...$(NC)"
	@trivy fs --security-checks vuln,config .
	@cargo audit

# Generate documentation
docs:
	@echo "$(BLUE)Generating documentation...$(NC)"
	@cargo doc --no-deps
	@cd docs && mkdocs build

# Performance benchmark
benchmark:
	@echo "$(BLUE)Running performance benchmarks...$(NC)"
	@cargo bench

# Initialize development environment
init:
	@echo "$(BLUE)Initializing ICARUS development environment...$(NC)"
	@./scripts/init-dev.sh

# Help
help:
	@echo "$(BLUE)ICARUS Makefile Commands:$(NC)"
	@echo "  $(GREEN)make all$(NC)         - Run security checks, build, and test"
	@echo "  $(GREEN)make build$(NC)       - Build all components"
	@echo "  $(GREEN)make test$(NC)        - Run all tests"
	@echo "  $(GREEN)make deploy$(NC)      - Deploy ICARUS"
	@echo "  $(GREEN)make dev$(NC)         - Start development environment"
	@echo "  $(GREEN)make clean$(NC)       - Clean build artifacts"
	@echo "  $(GREEN)make security-scan$(NC) - Run security scanning"
	@echo "  $(GREEN)make docs$(NC)        - Generate documentation"
	@echo "  $(GREEN)make benchmark$(NC)   - Run performance benchmarks"
	@echo "  $(GREEN)make init$(NC)        - Initialize development environment"