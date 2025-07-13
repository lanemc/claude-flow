/**
 * Database SQL Statements
 * Extracted from DatabaseManager to reduce file complexity
 */

export const SQL_STATEMENTS = {
  // Schema
  SCHEMA_PATH: '../../../db/hive-mind-schema.sql',
  
  // Swarm operations
  CREATE_SWARM: `
    INSERT INTO swarms (
      id, name, topology, queen_mode, max_agents, 
      consensus_threshold, memory_ttl, config, created_at, updated_at, is_active, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_SWARM: 'SELECT * FROM swarms WHERE id = ?',
  
  GET_ACTIVE_SWARM: 'SELECT id FROM swarms WHERE is_active = 1 LIMIT 1',
  
  SET_ACTIVE_SWARM: `
    UPDATE swarms SET is_active = 0;
    UPDATE swarms SET is_active = 1 WHERE id = ?;
  `,
  
  GET_ALL_SWARMS: `
    SELECT s.*, 
           (SELECT COUNT(*) FROM agents WHERE swarm_id = s.id) as agentCount
    FROM swarms s 
    ORDER BY s.created_at DESC
  `,
  
  // Agent operations
  CREATE_AGENT: `
    INSERT INTO agents (
      id, swarm_id, name, type, status, capabilities, current_task_id,
      message_count, error_count, success_count, created_at, last_active_at, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_AGENT: 'SELECT * FROM agents WHERE id = ?',
  
  GET_AGENTS: 'SELECT * FROM agents WHERE swarm_id = ? ORDER BY created_at',
  
  UPDATE_AGENT: 'UPDATE agents SET {{COLUMNS}} WHERE id = ?',
  
  UPDATE_AGENT_STATUS: 'UPDATE agents SET status = ?, last_active_at = ? WHERE id = ?',
  
  GET_AGENT_PERFORMANCE: `
    SELECT 
      a.success_count,
      a.error_count,
      (SELECT COUNT(*) FROM tasks WHERE assigned_agent_id = a.id AND status = 'completed') as completed_tasks,
      (SELECT COUNT(*) FROM tasks WHERE assigned_agent_id = a.id AND status = 'failed') as failed_tasks,
      (SELECT AVG(actual_duration) FROM tasks WHERE assigned_agent_id = a.id AND actual_duration IS NOT NULL) as avg_completion_time
    FROM agents a 
    WHERE a.id = ?
  `,
  
  // Task operations
  CREATE_TASK: `
    INSERT INTO tasks (
      id, swarm_id, type, description, status, priority, assigned_agent_id,
      dependencies, requirements, result, created_at, assigned_at, started_at,
      completed_at, estimated_duration, actual_duration, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_TASK: 'SELECT * FROM tasks WHERE id = ?',
  
  GET_TASKS: 'SELECT * FROM tasks WHERE swarm_id = ? ORDER BY created_at DESC',
  
  UPDATE_TASK: 'UPDATE tasks SET {{COLUMNS}} WHERE id = ?',
  
  UPDATE_TASK_STATUS: 'UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?',
  
  GET_PENDING_TASKS: `
    SELECT * FROM tasks 
    WHERE swarm_id = ? AND status IN ('pending', 'assigned') 
    ORDER BY 
      CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
      created_at
  `,
  
  GET_ACTIVE_TASKS: `
    SELECT t.*, a.name as agent_name
    FROM tasks t
    LEFT JOIN agents a ON t.assigned_agent_id = a.id
    WHERE t.swarm_id = ? AND t.status IN ('assigned', 'in_progress')
    ORDER BY t.created_at
  `,
  
  REASSIGN_TASK: `
    UPDATE tasks 
    SET assigned_agent_id = ?, status = 'assigned', assigned_at = ?
    WHERE id = ?
  `,
  
  // Memory operations
  STORE_MEMORY: `
    INSERT OR REPLACE INTO memory (
      key, namespace, value, access_count, last_accessed_at, created_at, updated_at, metadata, ttl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_MEMORY: 'SELECT * FROM memory WHERE key = ? AND namespace = ?',
  
  UPDATE_MEMORY_ACCESS: `
    UPDATE memory 
    SET access_count = access_count + 1, last_accessed_at = ? 
    WHERE key = ? AND namespace = ?
  `,
  
  SEARCH_MEMORY: `
    SELECT * FROM memory 
    WHERE namespace = ? AND (key LIKE ? OR value LIKE ?)
    ORDER BY access_count DESC, last_accessed_at DESC
    LIMIT ?
  `,
  
  DELETE_MEMORY: 'DELETE FROM memory WHERE key = ? AND namespace = ?',
  
  LIST_MEMORY: `
    SELECT * FROM memory 
    WHERE namespace = ? 
    ORDER BY last_accessed_at DESC, access_count DESC 
    LIMIT ?
  `,
  
  GET_MEMORY_STATS: `
    SELECT 
      COUNT(*) as totalEntries,
      SUM(LENGTH(value)) as totalSize,
      COUNT(DISTINCT namespace) as namespaceCount
    FROM memory
  `,
  
  GET_NAMESPACE_STATS: `
    SELECT 
      namespace,
      COUNT(*) as entryCount,
      SUM(LENGTH(value)) as totalSize,
      AVG(access_count) as avgAccessCount,
      MAX(last_accessed_at) as lastAccessed
    FROM memory 
    WHERE namespace = ?
    GROUP BY namespace
  `,
  
  GET_ALL_MEMORY: 'SELECT * FROM memory ORDER BY last_accessed_at DESC',
  
  GET_RECENT_MEMORY: 'SELECT * FROM memory ORDER BY created_at DESC LIMIT ?',
  
  GET_OLD_MEMORY: `
    SELECT * FROM memory 
    WHERE created_at < datetime('now', '-' || ? || ' days')
    ORDER BY created_at
  `,
  
  UPDATE_MEMORY_ENTRY: `
    UPDATE memory 
    SET value = ?, metadata = ?, updated_at = ?
    WHERE key = ? AND namespace = ?
  `,
  
  CLEAR_MEMORY: 'DELETE FROM memory WHERE namespace LIKE ?',
  
  DELETE_OLD_ENTRIES: `
    DELETE FROM memory 
    WHERE namespace = ? AND created_at < datetime('now', '-' || ? || ' seconds')
  `,
  
  TRIM_NAMESPACE: `
    DELETE FROM memory 
    WHERE namespace = ? AND rowid NOT IN (
      SELECT rowid FROM memory 
      WHERE namespace = ? 
      ORDER BY last_accessed_at DESC, access_count DESC 
      LIMIT ?
    )
  `,
  
  // Communication operations
  CREATE_COMMUNICATION: `
    INSERT INTO communications (
      id, swarm_id, from_agent_id, to_agent_id, message_type, content, metadata,
      broadcast_scope, priority, created_at, delivered_at, read_at, acknowledged_at,
      requires_response, parent_message_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_PENDING_MESSAGES: `
    SELECT * FROM communications 
    WHERE (to_agent_id = ? OR (to_agent_id IS NULL AND broadcast_scope IN ('swarm', 'global')))
      AND delivered_at IS NULL
    ORDER BY 
      CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
      created_at
  `,
  
  MARK_MESSAGE_DELIVERED: `
    UPDATE communications 
    SET delivered_at = ? 
    WHERE id = ?
  `,
  
  MARK_MESSAGE_READ: `
    UPDATE communications 
    SET read_at = ? 
    WHERE id = ?
  `,
  
  GET_RECENT_MESSAGES: `
    SELECT * FROM communications 
    WHERE swarm_id = ? AND created_at > datetime('now', '-' || ? || ' minutes')
    ORDER BY created_at DESC
  `,
  
  // Consensus operations
  CREATE_CONSENSUS_PROPOSAL: `
    INSERT INTO consensus (
      id, swarm_id, proposal_type, proposal_data, proposed_by, threshold_required,
      votes_for, votes_against, votes_total, status, created_at, resolved_at, timeout_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  SUBMIT_CONSENSUS_VOTE: `
    UPDATE consensus 
    SET votes_for = votes_for + ?, votes_against = votes_against + ?, votes_total = votes_total + 1
    WHERE id = ?
  `,
  
  GET_CONSENSUS_PROPOSAL: 'SELECT * FROM consensus WHERE id = ?',
  
  UPDATE_CONSENSUS_STATUS: 'UPDATE consensus SET status = ?, resolved_at = ? WHERE id = ?',
  
  GET_RECENT_CONSENSUS: `
    SELECT * FROM consensus 
    WHERE swarm_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `,
  
  // Performance operations
  STORE_PERFORMANCE_METRIC: `
    INSERT INTO performance_metrics (
      id, swarm_id, agent_id, task_id, metric_type, metric_value, metadata, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  GET_SWARM_STATS: `
    SELECT 
      (SELECT COUNT(*) FROM agents WHERE swarm_id = ?) as totalAgents,
      (SELECT COUNT(*) FROM agents WHERE swarm_id = ? AND status = 'active') as activeAgents,
      (SELECT COUNT(*) FROM agents WHERE swarm_id = ? AND status = 'busy') as busyAgents,
      (SELECT COUNT(*) FROM tasks WHERE swarm_id = ?) as totalTasks,
      (SELECT COUNT(*) FROM tasks WHERE swarm_id = ? AND status = 'completed') as completedTasks,
      (SELECT COUNT(*) FROM tasks WHERE swarm_id = ? AND status = 'failed') as failedTasks,
      (SELECT COUNT(*) FROM communications WHERE swarm_id = ? AND created_at > datetime('now', '-1 hour')) as communicationVolume
  `,
  
  GET_STRATEGY_PERFORMANCE: `
    SELECT 
      s.topology as strategy,
      ROUND(
        CAST(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS FLOAT) / 
        CAST(COUNT(t.id) AS FLOAT) * 100, 2
      ) as successRate,
      ROUND(AVG(t.actual_duration), 2) as avgCompletionTime,
      COUNT(t.id) as totalTasks,
      ROUND(
        CAST(SUM(CASE WHEN t.status = 'completed' AND t.created_at > datetime('now', '-7 days') THEN 1 ELSE 0 END) AS FLOAT) /
        CAST(SUM(CASE WHEN t.created_at > datetime('now', '-7 days') THEN 1 ELSE 0 END) AS FLOAT) * 100, 2
      ) as recentPerformance
    FROM swarms s
    LEFT JOIN tasks t ON s.id = t.swarm_id
    WHERE s.id = ?
    GROUP BY s.topology
  `,
  
  GET_SUCCESSFUL_DECISIONS: `
    SELECT m.* FROM memory m
    WHERE m.namespace LIKE ? || '%decision%'
      AND m.value LIKE '%success%'
    ORDER BY m.access_count DESC, m.created_at DESC
    LIMIT 20
  `,
  
  DELETE_MEMORY_ENTRY: 'DELETE FROM memory WHERE key = ? AND namespace = ?',
  
  // Health check
  HEALTH_CHECK_SWARMS: 'SELECT COUNT(*) as count FROM swarms',
  HEALTH_CHECK_AGENTS: 'SELECT COUNT(*) as count FROM agents',
  HEALTH_CHECK_TASKS: 'SELECT COUNT(*) as count FROM tasks',
  HEALTH_CHECK_MEMORY: 'SELECT COUNT(*) as count FROM memory',
  HEALTH_CHECK_COMMUNICATIONS: 'SELECT COUNT(*) as count FROM communications'
};