/**
 * Examples of using enhanced memory features
 */

import { EnhancedMemory } from './enhanced-memory.js';

// Initialize enhanced memory
const enhancedMemory = new EnhancedMemory();
await enhancedMemory.initialize();

// === 1. Session Management Example ===
async function exampleSessionManagement(): Promise<void> {
  console.log('\n=== Session Management ===');
  
  // Save current session state
  const sessionId = `session-${Date.now()}`;
  await enhancedMemory.saveSessionState(sessionId, {
    state: 'active',
    context: {
      currentTask: 'Implementing authentication',
      openFiles: ['src/auth.js', 'src/middleware/auth.js'],
      cursorPositions: { 'src/auth.js': { line: 45, column: 12 } },
      activeAgents: ['AuthExpert', 'SecurityReviewer'],
      completedSteps: ['Design API', 'Create models'],
      nextSteps: ['Implement JWT', 'Add tests']
    }
  });
  
  console.log('Session saved:', sessionId);
  
  // Later, resume the session
  const resumed = await enhancedMemory.resumeSession(sessionId);
  console.log('Resumed context:', resumed?.context);
}

// === 2. Performance Tracking Example ===
async function examplePerformanceTracking(): Promise<void> {
  console.log('\n=== Performance Tracking ===');
  
  const startTime = Date.now();
  
  // Track a successful operation
  await enhancedMemory.trackPerformance(
    'memory_usage',
    Date.now() - startTime,
    true,
    { action: 'store', key: 'test', value: 'data' }
  );
  
  // Track a failed operation
  await enhancedMemory.trackPerformance(
    'swarm_init',
    150,
    false,
    { topology: 'invalid', error: 'Invalid topology specified' }
  );
  
  // Get performance statistics
  const stats = await enhancedMemory.getPerformanceStats('memory_usage');
  console.log('Performance stats:', stats);
}

// === 3. Knowledge Storage Example ===
async function exampleKnowledgeStorage(): Promise<void> {
  console.log('\n=== Knowledge Storage ===');
  
  // Store knowledge
  await enhancedMemory.storeKnowledge(
    'javascript',
    'async-patterns',
    {
      pattern: 'Promise.all',
      description: 'Execute multiple async operations in parallel',
      example: 'const results = await Promise.all([fetch1(), fetch2()]);'
    },
    { complexity: 'medium', category: 'concurrency' }
  );
  
  // Retrieve knowledge
  const knowledge = await enhancedMemory.retrieveKnowledge('javascript', 'async-patterns');
  console.log('Retrieved knowledge:', knowledge?.value.pattern);
  
  // Search knowledge
  const searchResults = await enhancedMemory.searchKnowledge('javascript', 'async');
  console.log('Found knowledge entries:', searchResults.length);
}

// === 4. Agent Registration Example ===
async function exampleAgentManagement(): Promise<void> {
  console.log('\n=== Agent Management ===');
  
  // Register an agent
  await enhancedMemory.registerAgent('agent-1', {
    type: 'coder',
    capabilities: ['javascript', 'typescript', 'react']
  });
  
  // Update agent status
  await enhancedMemory.updateAgentStatus('agent-1', 'working', {
    tasksCompleted: 5,
    successRate: 0.95
  });
  
  // Get active agents
  const activeAgents = await enhancedMemory.getActiveAgents();
  console.log('Active agents:', activeAgents.length);
}

// Run all examples
async function runAllExamples(): Promise<void> {
  await exampleSessionManagement();
  await examplePerformanceTracking();
  
  // Show memory statistics
  const stats = await enhancedMemory.getStats();
  console.log('\n=== Memory Statistics ===');
  console.log(stats);
  
  enhancedMemory.close();
}

// Export for testing
export {
  exampleSessionManagement,
  examplePerformanceTracking,
  exampleKnowledgeStorage,
  exampleAgentManagement,
  runAllExamples
};