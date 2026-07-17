#!/usr/bin/env bash
set -euo pipefail

echo "🚀 FactuFlow — Setup"
echo "===================="

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install Node.js >= 20."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Install pnpm >= 9."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker not found — infrastructure services will need to be started separately."; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required. Current version: $(node -v)"
  exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
  echo "✅ .env created. Please review and update values."
else
  echo "✅ .env already exists."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo ""
echo "🗄️  Generating Prisma client..."
pnpm run db:generate

# Start Docker services
if command -v docker >/dev/null 2>&1; then
  echo ""
  echo "🐳 Starting Docker services..."
  docker compose up -d
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 3
fi

# Run migrations
echo ""
echo "🔄 Running database migrations..."
pnpm run db:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "   Start development servers:"
echo "     pnpm run dev"
echo ""
echo "   Services:"
echo "     API:  http://localhost:3001"
echo "     Web:  http://localhost:3000"
echo "     Docs: http://localhost:3001/api/docs"
echo "     Mail: http://localhost:8025"
