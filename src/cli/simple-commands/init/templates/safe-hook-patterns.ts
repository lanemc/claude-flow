/**
 * Safe Hook Patterns - Templates for safe Claude Code hook configurations with TypeScript support
 * 
 * These patterns prevent infinite loops that could cost thousands of dollars
 * by avoiding recursive hook execution when hooks call 'claude' commands.
 */

import type { SafeHookPattern } from '../../../../types/template.js';

/**
 * DANGEROUS PATTERN - DO NOT USE
 * This creates an infinite loop that can cost thousands of dollars!
 */
export const DANGEROUS_PATTERN_EXAMPLE: SafeHookPattern = {
  name: "DANGEROUS: Stop hook calling claude command",
  description: "❌ NEVER USE THIS - Creates infinite recursion loop",
  pattern: {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "claude -c -p \"Update all changes to history.md\""
      }]
    }]
  },
  problems: [
    "🚨 Creates infinite loop: Stop → claude command → Stop → claude command...",
    "💰 Can cost $3600+ per day by bypassing rate limits",
    "🚫 Makes system unresponsive",
    "⚡ No built-in protection in Claude Code"
  ]
};

/**
 * SAFE PATTERN 1: Flag-based updates
 * Set a flag instead of calling claude directly
 */
export const SAFE_FLAG_PATTERN: SafeHookPattern = {
  name: "Safe Pattern: Flag-based updates",
  description: "✅ Set flag when update needed, run manually",
  pattern: {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "bash -c 'echo \"History update needed at $(date)\" > ~/.claude/needs_update && echo \"📝 History update flagged. Run: claude -c -p \\\"Update history.md\\\"\"'"
      }]
    }]
  },
  benefits: [
    "✅ No recursion - just sets a flag",
    "💰 Zero risk of infinite API calls",
    "🔄 User controls when update runs",
    "📝 Clear instructions for manual execution"
  ],
  usage: [
    "1. Hook sets flag when update is needed",
    "2. User sees notification",
    "3. User manually runs: claude -c -p \"Update history.md\"",
    "4. Update runs once safely"
  ]
};

/**
 * SAFE PATTERN 2: PostToolUse hooks instead of Stop hooks
 * React to specific tool usage rather than session end
 */
export const SAFE_POST_TOOL_PATTERN: SafeHookPattern = {
  name: "Safe Pattern: PostToolUse hooks",
  description: "✅ React to specific file operations instead of Stop events",
  pattern: {
    "PostToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "echo 'File modified: {file}' >> ~/.claude/modifications.log"
      }]
    }]
  },
  benefits: [
    "✅ Only triggers on actual file changes",
    "🎯 More precise than Stop hooks",
    "📝 Logs specific modifications",
    "🔄 No risk of Stop hook recursion"
  ],
  usage: [
    "1. Triggers only when files are written/edited",
    "2. Logs the specific file that was modified", 
    "3. Can be used for change tracking",
    "4. Safe to use with any logging command"
  ]
};

/**
 * SAFE PATTERN 3: Conditional execution with skip-hooks
 * Check for hook context before executing claude commands
 */
export const SAFE_CONDITIONAL_PATTERN: SafeHookPattern = {
  name: "Safe Pattern: Conditional with skip-hooks",
  description: "✅ Use --skip-hooks flag to prevent recursion",
  pattern: {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "bash -c 'if [ -z \"$CLAUDE_HOOK_CONTEXT\" ]; then claude --skip-hooks -c -p \"Update history.md\"; fi'"
      }]
    }]
  },
  benefits: [
    "✅ --skip-hooks prevents recursive execution",
    "🎯 Updates run only in non-hook context",
    "🔒 Built-in safety mechanism",
    "⚡ Automatic execution when safe"
  ],
  usage: [
    "1. Check if running in hook context",
    "2. Use --skip-hooks flag for claude command",
    "3. Prevents hook from triggering itself",
    "4. Safe for automated updates"
  ]
};

/**
 * SAFE PATTERN 4: External script execution
 * Delegate updates to external scripts that don't trigger hooks
 */
export const SAFE_EXTERNAL_SCRIPT_PATTERN: SafeHookPattern = {
  name: "Safe Pattern: External script execution",
  description: "✅ Run updates via external scripts",
  pattern: {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/scripts/update_history.sh"
      }]
    }]
  },
  benefits: [
    "✅ Script runs outside hook context",
    "📝 Can include complex logic",
    "🔧 Easy to maintain and update",
    "🚀 No recursion risk"
  ],
  usage: [
    "1. Create script at ~/.claude/scripts/update_history.sh",
    "2. Script can safely call claude with --skip-hooks",
    "3. Hook executes script on Stop",
    "4. No recursive hook triggering"
  ]
};

/**
 * SAFE PATTERN 5: Time-based throttling
 * Prevent frequent executions with timestamp checks
 */
export const SAFE_THROTTLED_PATTERN: SafeHookPattern = {
  name: "Safe Pattern: Time-based throttling",
  description: "✅ Throttle updates to prevent excessive calls",
  pattern: {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "bash -c 'LAST_RUN=$(cat ~/.claude/last_update 2>/dev/null || echo 0); NOW=$(date +%s); if [ $((NOW - LAST_RUN)) -gt 3600 ]; then echo $NOW > ~/.claude/last_update && echo \"Update needed - run manually\"; fi'"
      }]
    }]
  },
  benefits: [
    "✅ Prevents frequent executions",
    "⏰ Configurable time window",
    "💰 Cost-effective approach",
    "📊 Trackable execution history"
  ],
  usage: [
    "1. Check timestamp of last execution",
    "2. Only proceed if enough time passed (1 hour)",
    "3. Update timestamp file",
    "4. Notify user to run update manually"
  ]
};

/**
 * Collection of all safe patterns for easy access
 */
export const SAFE_PATTERNS: SafeHookPattern[] = [
  SAFE_FLAG_PATTERN,
  SAFE_POST_TOOL_PATTERN,
  SAFE_CONDITIONAL_PATTERN,
  SAFE_EXTERNAL_SCRIPT_PATTERN,
  SAFE_THROTTLED_PATTERN
];

/**
 * Get a safe pattern by name
 */
export function getSafePattern(name: string): SafeHookPattern | undefined {
  return SAFE_PATTERNS.find(pattern => pattern.name.toLowerCase().includes(name.toLowerCase()));
}

/**
 * Validate if a hook pattern is safe
 */
export function isHookPatternSafe(pattern: any): { safe: boolean; reason?: string } {
  // Check for dangerous patterns
  const patternStr = JSON.stringify(pattern);
  
  // Direct claude command in Stop hook without safeguards
  if (patternStr.includes('"Stop"') && patternStr.includes('claude') && !patternStr.includes('--skip-hooks')) {
    return {
      safe: false,
      reason: "Stop hook calls claude command without --skip-hooks flag"
    };
  }
  
  // Recursive potential without throttling
  if (patternStr.includes('"Stop"') && patternStr.includes('claude -c')) {
    return {
      safe: false,
      reason: "Stop hook may cause infinite recursion with claude -c command"
    };
  }
  
  return { safe: true };
}

/**
 * Generate a safe hook pattern based on requirements
 */
export function generateSafeHookPattern(options: {
  trigger: 'Stop' | 'PostToolUse' | 'PreToolUse';
  action: string;
  useFlagPattern?: boolean;
  useThrottling?: boolean;
}): SafeHookPattern {
  const { trigger, action, useFlagPattern = true, useThrottling = false } = options;
  
  let command = action;
  
  // Apply safety mechanisms
  if (useFlagPattern && trigger === 'Stop' && action.includes('claude')) {
    command = `bash -c 'echo "${action}" > ~/.claude/pending_action && echo "Action flagged for manual execution"'`;
  } else if (useThrottling) {
    command = `bash -c 'LAST_RUN=$(cat ~/.claude/last_${trigger.toLowerCase()} 2>/dev/null || echo 0); NOW=$(date +%s); if [ $((NOW - LAST_RUN)) -gt 300 ]; then echo $NOW > ~/.claude/last_${trigger.toLowerCase()} && ${action}; fi'`;
  }
  
  return {
    name: `Generated Safe Pattern: ${trigger} with ${useFlagPattern ? 'flag' : useThrottling ? 'throttling' : 'direct'} execution`,
    description: `Safe pattern for ${trigger} hook with ${action}`,
    pattern: {
      [trigger]: [{
        matcher: trigger === 'PostToolUse' ? 'Write|Edit|MultiEdit' : '',
        hooks: [{
          type: 'command',
          command
        }]
      }]
    },
    benefits: [
      useFlagPattern ? "Uses flag pattern to prevent recursion" : "",
      useThrottling ? "Throttles execution to prevent excessive calls" : "",
      "Safe for production use"
    ].filter(Boolean),
    usage: [
      `Triggers on ${trigger} event`,
      useFlagPattern ? "Sets flag for manual execution" : "Executes action directly",
      useThrottling ? "Throttled to prevent frequent calls" : ""
    ].filter(Boolean)
  };
}