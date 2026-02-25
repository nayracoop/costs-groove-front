#!/bin/bash

# Fix all ESLint issues (indentation, quotes, etc.) across all projects
# Make sure to use Node 22

nvm use 22

echo "🔧 Fixing ESLint issues in all projects..."
echo ""

# Fix nyr-module
echo "📦 Fixing nyr-module..."
cd nyr-module && npm run lint:fix && cd ..

# Fix nyr-show
echo "📦 Fixing nyr-show..."
cd nyr-show && npm run lint:fix && cd ..

# Fix nyr-test
echo "📦 Fixing nyr-test..."
cd nyr-test && npm run lint:fix && cd ..

echo ""
echo "✅ All projects fixed!"
