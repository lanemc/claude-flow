#!/bin/bash

# Continuous Validation Script for TypeScript Migration

echo "Starting continuous validation monitoring..."

# Function to check metrics
check_metrics() {
    echo "=== Validation Check at $(date) ==="
    
    # Count JS files
    JS_COUNT=$(find src -name "*.js" | grep -v node_modules | wc -l | tr -d ' ')
    echo "JavaScript files remaining: $JS_COUNT"
    
    # Count TS errors
    TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
    echo "TypeScript compilation errors: $TS_ERRORS"
    
    # Check test status
    echo "Running quick test check..."
    
    # ESLint check
    ESLINT_ERRORS=$(npm run lint 2>&1 | grep -E "[0-9]+ errors" | grep -oE "[0-9]+" | head -1 || echo "0")
    echo "ESLint errors: $ESLINT_ERRORS"
    
    # Log to report
    echo -e "\n### Check at $(date)" >> MIGRATION_VALIDATION_LOG.md
    echo "- JS files: $JS_COUNT" >> MIGRATION_VALIDATION_LOG.md
    echo "- TS errors: $TS_ERRORS" >> MIGRATION_VALIDATION_LOG.md
    echo "- ESLint errors: $ESLINT_ERRORS" >> MIGRATION_VALIDATION_LOG.md
    
    # Alert if blocking issues
    if [ "$TS_ERRORS" -gt 200 ]; then
        echo "⚠️  HIGH TS ERROR COUNT - May block other agents!"
    fi
    
    echo "==============================="
}

# Initial check
check_metrics

# Run TypeScript compiler in watch mode in background
echo "Starting TypeScript compiler in watch mode..."
npx tsc --watch --noEmit --preserveWatchOutput &
TSC_PID=$!

# Monitor loop
while true; do
    sleep 30
    check_metrics
done

# Cleanup on exit
trap "kill $TSC_PID 2>/dev/null" EXIT