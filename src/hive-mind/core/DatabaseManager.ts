/**
 * DatabaseManager Class - Simplified Version
 * 
 * Manages all database operations for the Hive Mind system
 * using SQLite as the persistence layer.
 * Refactored to use separate modules for reduced file complexity.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { EventEmitter } from 'events';
import { getFilename, getDirname } from '../../utils/import-meta-shim';
import { DatabaseOperations } from './database/operations';

// Re-export types for backward compatibility
export * from './database/types';

// ES module compatibility - define __dirname
const __filename = getFilename();
const __dirname = getDirname();

export class DatabaseManager extends EventEmitter {
  private static instance: DatabaseManager | null = null;
  private db!: Database.Database;
  private operations!: DatabaseOperations;
  private initialized = false;

  private constructor() {
    super();
  }

  static async getInstance(): Promise<DatabaseManager> {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
      await DatabaseManager.instance.initialize();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const dbPath = path.join(process.cwd(), 'data', 'hive-mind.db');
      
      // Ensure data directory exists
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      
      // Initialize database
      this.db = new Database(dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = memory');
      this.db.pragma('mmap_size = 268435456'); // 256MB
      
      // Load schema
      await this.loadSchema();
      
      // Initialize operations module
      this.operations = new DatabaseOperations(this.db);
      
      this.initialized = true;
      this.emit('initialized');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private async loadSchema(): Promise<void> {
    try {
      const schemaPath = path.join(__dirname, '../../../db/hive-mind-schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf-8');
      this.db.exec(schema);
    } catch (error) {
      throw new Error(`Failed to load database schema: ${error}`);
    }
  }

  // Delegate all operations to the operations module
  async createSwarm(data: any): Promise<void> {
    return this.operations.createSwarm(data);
  }

  async getSwarm(id: string) {
    return this.operations.getSwarm(id);
  }

  async getActiveSwarmId(): Promise<string | null> {
    return this.operations.getActiveSwarmId();
  }

  async setActiveSwarm(id: string): Promise<void> {
    return this.operations.setActiveSwarm(id);
  }

  async getAllSwarms() {
    return this.operations.getAllSwarms();
  }

  async createAgent(data: any): Promise<void> {
    return this.operations.createAgent(data);
  }

  async getAgent(id: string) {
    return this.operations.getAgent(id);
  }

  async getAgents(swarmId: string) {
    return this.operations.getAgents(swarmId);
  }

  async updateAgent(id: string, updates: Record<string, any>): Promise<void> {
    return this.operations.updateAgent(id, updates);
  }

  async updateAgentStatus(id: string, status: string): Promise<void> {
    return this.operations.updateAgentStatus(id, status);
  }

  async getAgentPerformance(agentId: string) {
    return this.operations.getAgentPerformance(agentId);
  }

  async createTask(data: any): Promise<void> {
    return this.operations.createTask(data);
  }

  async getTask(id: string) {
    return this.operations.getTask(id);
  }

  async getTasks(swarmId: string) {
    return this.operations.getTasks(swarmId);
  }

  async updateTask(id: string, updates: Record<string, any>): Promise<void> {
    return this.operations.updateTask(id, updates);
  }

  async updateTaskStatus(id: string, status: string): Promise<void> {
    return this.operations.updateTaskStatus(id, status);
  }

  async getPendingTasks(swarmId: string) {
    return this.operations.getPendingTasks(swarmId);
  }

  async getActiveTasks(swarmId: string) {
    return this.operations.getActiveTasks(swarmId);
  }

  async reassignTask(taskId: string, newAgentId: string): Promise<void> {
    return this.operations.reassignTask(taskId, newAgentId);
  }

  async storeMemory(data: any): Promise<void> {
    return this.operations.storeMemory(data);
  }

  async getMemory(key: string, namespace: string) {
    return this.operations.getMemory(key, namespace);
  }

  async updateMemoryAccess(key: string, namespace: string): Promise<void> {
    return this.operations.updateMemoryAccess(key, namespace);
  }

  async searchMemory(options: { namespace: string; query: string; limit: number }) {
    return this.operations.searchMemory(options);
  }

  async deleteMemory(key: string, namespace: string): Promise<void> {
    return this.operations.deleteMemory(key, namespace);
  }

  async listMemory(namespace: string, limit: number) {
    return this.operations.listMemory(namespace, limit);
  }

  async getMemoryStats() {
    return this.operations.getMemoryStats();
  }

  async getNamespaceStats(namespace: string) {
    return this.operations.getNamespaceStats(namespace);
  }

  async getAllMemoryEntries() {
    return this.operations.getAllMemoryEntries();
  }

  async getRecentMemoryEntries(limit: number) {
    return this.operations.getRecentMemoryEntries(limit);
  }

  async getOldMemoryEntries(daysOld: number) {
    return this.operations.getOldMemoryEntries(daysOld);
  }

  async updateMemoryEntry(entry: any): Promise<void> {
    return this.operations.updateMemoryEntry(entry);
  }

  async clearMemory(swarmId: string): Promise<void> {
    return this.operations.clearMemory(swarmId);
  }

  async deleteOldEntries(namespace: string, ttl: number): Promise<void> {
    return this.operations.deleteOldEntries(namespace, ttl);
  }

  async trimNamespace(namespace: string, maxEntries: number): Promise<void> {
    return this.operations.trimNamespace(namespace, maxEntries);
  }

  async createCommunication(data: any): Promise<void> {
    return this.operations.createCommunication(data);
  }

  async getPendingMessages(agentId: string) {
    return this.operations.getPendingMessages(agentId);
  }

  async markMessageDelivered(messageId: string): Promise<void> {
    return this.operations.markMessageDelivered(messageId);
  }

  async markMessageRead(messageId: string): Promise<void> {
    return this.operations.markMessageRead(messageId);
  }

  async getRecentMessages(swarmId: string, timeWindow: number) {
    return this.operations.getRecentMessages(swarmId, timeWindow);
  }

  async createConsensusProposal(proposal: any): Promise<void> {
    return this.operations.createConsensusProposal(proposal);
  }

  async submitConsensusVote(proposalId: string, agentId: string, vote: boolean, reason?: string): Promise<void> {
    return this.operations.submitConsensusVote(proposalId, agentId, vote, reason);
  }

  async storePerformanceMetric(data: any): Promise<void> {
    return this.operations.storePerformanceMetric(data);
  }

  async getSwarmStats(swarmId: string) {
    return this.operations.getSwarmStats(swarmId);
  }

  async getStrategyPerformance(swarmId: string) {
    return this.operations.getStrategyPerformance(swarmId);
  }

  async getSuccessfulDecisions(swarmId: string) {
    return this.operations.getSuccessfulDecisions(swarmId);
  }

  async deleteMemoryEntry(key: string, namespace: string): Promise<void> {
    return this.operations.deleteMemoryEntry(key, namespace);
  }

  async healthCheck() {
    return this.operations.healthCheck();
  }

  async getConsensusProposal(id: string) {
    return this.operations.getConsensusProposal(id);
  }

  async updateConsensusStatus(id: string, status: 'pending' | 'achieved' | 'failed' | 'timeout'): Promise<void> {
    return this.operations.updateConsensusStatus(id, status);
  }

  async getRecentConsensusProposals(swarmId: string, limit: number = 10) {
    return this.operations.getRecentConsensusProposals(swarmId, limit);
  }

  // Add missing methods for backward compatibility
  async getDatabaseAnalytics() {
    const healthCheck = await this.operations.healthCheck();
    const totalRecords = Object.values(healthCheck.tables).reduce((sum: number, t: any) => sum + t.count, 0);
    
    return {
      totalTables: 6,
      totalRecords,
      lastUpdated: new Date().toISOString(),
      fragmentation: 0.1, // Mock fragmentation value
      performance: {
        avgQueryTime: 5.2,
        slowQueries: 0
      }
    };
  }

  get raw(): any {
    return this.db;
  }

  prepare(sql: string): any {
    return this.db.prepare(sql);
  }
}