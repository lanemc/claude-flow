#!/bin/bash

# Build script for Claude Code Console TypeScript files

echo "🚀 Building Claude Code Console TypeScript files..."

# Check if TypeScript is installed
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript compiler (tsc) not found. Please install TypeScript globally:"
    echo "   npm install -g typescript"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p ./js

# Clean previous build artifacts (optional)
# rm -rf ./js/*.js ./js/*.js.map ./js/*.d.ts

# Compile TypeScript files
echo "📦 Compiling TypeScript files..."
tsc -p ./tsconfig.json

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
    
    # List generated files
    echo ""
    echo "📄 Generated files:"
    ls -la ./js/*.js 2>/dev/null | awk '{print "   " $9}'
    
    # Generate index file that exports all modules
    echo ""
    echo "📝 Generating index.js..."
    cat > ./js/index.js << 'EOF'
/**
 * Claude Code Console UI - Main Entry Point
 * Auto-generated file that exports all TypeScript modules
 */

// Export all modules
export { MemoryInterface } from './memory-interface.js';
export { MemoryTest, runMemoryTests } from './memory-test.js';
export { SettingsManager } from './settings.js';

// Export types (if needed by other modules)
export * from './types.js';

// Initialize global references for backward compatibility
if (typeof window !== 'undefined') {
  // These are already set in individual files, but ensure they're available
  window.MemoryInterface = window.MemoryInterface || MemoryInterface;
  window.SettingsManager = window.SettingsManager || SettingsManager;
  window.runMemoryTests = window.runMemoryTests || runMemoryTests;
}

console.log('Claude Code Console UI modules loaded successfully');
EOF

    echo "✅ Build completed successfully!"
    
else
    echo "❌ TypeScript compilation failed!"
    exit 1
fi

# Optional: Run type checking without emitting files
echo ""
echo "🔍 Running type check..."
tsc --noEmit -p ./tsconfig.json

if [ $? -eq 0 ]; then
    echo "✅ Type checking passed!"
else
    echo "⚠️  Type checking found issues (files were still compiled)"
fi

echo ""
echo "🎉 Build process complete!"