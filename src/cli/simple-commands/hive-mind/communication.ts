/**
 * Swarm Communication System for Hive Mind
 * Handles inter-agent messaging and coordination
 */

import EventEmitter from 'events';
import crypto from 'crypto';

/**
 * Message type configuration interface
 */
interface MessageTypeConfig {
  priority: number;
  reliable: boolean;
  encrypted: boolean;
}

/**
 * Message types and their priorities
 */
const MESSAGE_TYPES: Record<string, MessageTypeConfig> = {
  command: { priority: 1, reliable: true, encrypted: true },
  query: { priority: 2, reliable: true, encrypted: false },
  response: { priority: 2, reliable: true, encrypted: false },
  broadcast: { priority: 3, reliable: false, encrypted: false },
  heartbeat: { priority: 4, reliable: false, encrypted: false },
  consensus: { priority: 1, reliable: true, encrypted: true },
  task: { priority: 2, reliable: true, encrypted: false },
  result: { priority: 2, reliable: true, encrypted: false },
  error: { priority: 1, reliable: true, encrypted: false },
  sync: { priority: 3, reliable: true, encrypted: false }
};

/**
 * Communication protocols
 */
const PROTOCOLS = {
  direct: 'direct',        // Point-to-point
  broadcast: 'broadcast',  // One-to-all
  multicast: 'multicast',  // One-to-many
  gossip: 'gossip',       // Epidemic spread
  consensus: 'consensus'   // Byzantine agreement
} as const;

export type ProtocolType = typeof PROTOCOLS[keyof typeof PROTOCOLS];

/**
 * Communication configuration interface
 */
export interface CommunicationConfig {
  swarmId?: string;
  encryption?: boolean;
  maxRetries?: number;
  timeout?: number;
  bufferSize?: number;
  gossipFanout?: number;
  consensusQuorum?: number;
}

/**
 * Agent metadata interface
 */
export interface AgentMetadata {
  type?: string;
  capabilities?: string[];
  version?: string;
  [key: string]: any;
}

/**
 * Agent interface
 */
export interface Agent {
  id: string;
  status: 'online' | 'offline';
  lastSeen: number;
  metadata: AgentMetadata;
  messageCount: number;
  channel: CommunicationChannel;
}

/**
 * Message envelope interface
 */
export interface MessageEnvelope {
  id: string;
  from: string;
  to: string;
  type: string;
  timestamp: number;
  message: any;
  protocol: ProtocolType;
  encrypted?: boolean;
  groupId?: string;
}

/**
 * Gossip data interface
 */
interface GossipData {
  originalId: string;
  hops: number;
  seen: string[];
}

/**
 * Message with gossip metadata interface
 */
interface GossipMessage {
  _gossip: GossipData;
  [key: string]: any;
}

/**
 * Encrypted message interface
 */
interface EncryptedMessage {
  iv: string;
  data: string;
}

/**
 * Message history entry interface
 */
interface MessageHistoryEntry extends MessageEnvelope {
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  attempts: number;
  sentAt?: number;
}

/**
 * Communication channel interface
 */
interface CommunicationChannel {
  send(message: any): void;
  close(): void;
}

/**
 * Vote count interface
 */
interface VoteCount {
  [vote: string]: number;
}

/**
 * Consensus proposal interface
 */
export interface ConsensusProposal {
  id: string;
  data: any;
  timestamp: number;
}

/**
 * Consensus result interface
 */
export interface ConsensusResult {
  consensusId: string;
  proposal: ConsensusProposal;
  validators: number;
  votes: Record<string, string | null>;
  voteCount: VoteCount;
  winner: string | null;
  consensusReached: boolean;
  quorum: number;
  timestamp: number;
}

/**
 * Communication statistics interface
 */
export interface CommunicationStatistics {
  agents: {
    total: number;
    online: number;
    offline: number;
  };
  messages: {
    sent: number;
    received: number;
    failed: number;
    encrypted: number;
    buffered: number;
  };
  performance: {
    avgLatency: string;
    successRate: string;
  };
}

/**
 * Metrics interface
 */
interface Metrics {
  sent: number;
  received: number;
  failed: number;
  encrypted: number;
  latency: number[];
}

/**
 * Communication state interface
 */
interface CommunicationState {
  agents: Map<string, Agent>;
  channels: Map<string, CommunicationChannel>;
  messageBuffer: MessageEnvelope[];
  messageHistory: Map<string, MessageHistoryEntry>;
  metrics: Metrics;
}

/**
 * SwarmCommunication class
 */
export class SwarmCommunication extends EventEmitter {
  public config: Required<CommunicationConfig>;
  private state: CommunicationState;
  private encryptionKey: Buffer | null;
  private messageProcessor: NodeJS.Timeout;
  private heartbeatTimer: NodeJS.Timeout;

  constructor(config: CommunicationConfig = {}) {
    super();
    
    this.config = {
      swarmId: config.swarmId || 'default-swarm',
      encryption: config.encryption || false,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 5000,
      bufferSize: config.bufferSize || 1000,
      gossipFanout: config.gossipFanout || 3,
      consensusQuorum: config.consensusQuorum || 0.67
    };
    
    this.state = {
      agents: new Map(),
      channels: new Map(),
      messageBuffer: [],
      messageHistory: new Map(),
      metrics: {
        sent: 0,
        received: 0,
        failed: 0,
        encrypted: 0,
        latency: []
      }
    };
    
    this.encryptionKey = this.config.encryption 
      ? crypto.randomBytes(32) 
      : null;
    
    this._initialize();
  }
  
  /**
   * Initialize communication system
   */
  private _initialize(): void {
    // Set up message processing
    this.messageProcessor = setInterval(() => {
      this._processMessageBuffer();
    }, 100);
    
    // Set up heartbeat
    this.heartbeatTimer = setInterval(() => {
      this._sendHeartbeats();
    }, 10000);
    
    this.emit('communication:initialized', { swarmId: this.config.swarmId });
  }
  
  /**
   * Register agent in communication network
   */
  registerAgent(agentId: string, metadata: AgentMetadata = {}): Agent {
    const agent: Agent = {
      id: agentId,
      status: 'online',
      lastSeen: Date.now(),
      metadata,
      messageCount: 0,
      channel: this._createChannel(agentId)
    };
    
    this.state.agents.set(agentId, agent);
    
    // Announce new agent to swarm
    this.broadcast({
      type: 'agent_joined',
      agentId,
      metadata
    }, 'sync');
    
    this.emit('agent:registered', agent);
    return agent;
  }
  
  /**
   * Unregister agent from network
   */
  unregisterAgent(agentId: string): void {
    const agent = this.state.agents.get(agentId);
    if (!agent) return;
    
    // Close channel
    const channel = this.state.channels.get(agentId);
    if (channel) {
      channel.close();
      this.state.channels.delete(agentId);
    }
    
    this.state.agents.delete(agentId);
    
    // Announce agent departure
    this.broadcast({
      type: 'agent_left',
      agentId
    }, 'sync');
    
    this.emit('agent:unregistered', { agentId });
  }
  
  /**
   * Send direct message to agent
   */
  async send(toAgentId: string, message: any, type: string = 'query'): Promise<{ messageId: string; delivered: boolean }> {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();
    
    const envelope: MessageEnvelope = {
      id: messageId,
      from: 'system', // Will be set by sender
      to: toAgentId,
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.direct
    };
    
    // Encrypt if needed
    if (this.config.encryption && MESSAGE_TYPES[type]?.encrypted) {
      envelope.message = this._encrypt(message);
      envelope.encrypted = true;
      this.state.metrics.encrypted++;
    }
    
    // Add to buffer
    this._addToBuffer(envelope);
    
    // Track message
    this.state.messageHistory.set(messageId, {
      ...envelope,
      status: 'pending',
      attempts: 0
    });
    
    this.state.metrics.sent++;
    
    // Return promise that resolves when message is acknowledged
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Message timeout: ${messageId}`));
      }, this.config.timeout);
      
      this.once(`ack:${messageId}`, () => {
        clearTimeout(timeout);
        resolve({ messageId, delivered: true });
      });
      
      this.once(`nack:${messageId}`, (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
  
  /**
   * Broadcast message to all agents
   */
  broadcast(message: any, type: string = 'broadcast'): { messageId: string; recipients: number } {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();
    
    const envelope: MessageEnvelope = {
      id: messageId,
      from: 'system',
      to: '*',
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.broadcast
    };
    
    // Broadcasts are typically not encrypted
    this._addToBuffer(envelope);
    
    this.state.metrics.sent++;
    
    this.emit('message:broadcast', envelope);
    
    return { messageId, recipients: this.state.agents.size };
  }
  
  /**
   * Multicast message to specific agents
   */
  multicast(agentIds: string[], message: any, type: string = 'query'): { messageId: string; recipients: number } {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();
    
    const envelopes = agentIds.map(agentId => ({
      id: `${messageId}-${agentId}`,
      from: 'system',
      to: agentId,
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.multicast,
      groupId: messageId
    }));
    
    envelopes.forEach(envelope => this._addToBuffer(envelope));
    
    this.state.metrics.sent += envelopes.length;
    
    return { messageId, recipients: agentIds.length };
  }
  
  /**
   * Gossip protocol for epidemic spread
   */
  gossip(message: any, type: string = 'sync'): { messageId: string; initialTargets: string[] } {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();
    
    // Select random agents for initial spread
    const agents = Array.from(this.state.agents.keys());
    const selected = this._selectRandomAgents(agents, this.config.gossipFanout);
    
    selected.forEach(agentId => {
      const envelope: MessageEnvelope = {
        id: `${messageId}-${agentId}`,
        from: 'system',
        to: agentId,
        type,
        timestamp,
        message: {
          ...message,
          _gossip: {
            originalId: messageId,
            hops: 0,
            seen: []
          }
        },
        protocol: PROTOCOLS.gossip
      };
      
      this._addToBuffer(envelope);
    });
    
    this.state.metrics.sent += selected.length;
    
    return { messageId, initialTargets: selected };
  }
  
  /**
   * Byzantine consensus protocol
   */
  async consensus(proposal: ConsensusProposal, validators: string[] = []): Promise<ConsensusResult> {
    const consensusId = this._generateMessageId();
    const timestamp = Date.now();
    
    // If no validators specified, use all online agents
    if (validators.length === 0) {
      validators = Array.from(this.state.agents.keys())
        .filter(id => this.state.agents.get(id)?.status === 'online');
    }
    
    const votes = new Map<string, string | null>();
    const votePromises: Promise<{ agentId: string; vote: string | null }>[] = [];
    
    // Phase 1: Proposal
    validators.forEach(agentId => {
      const envelope: MessageEnvelope = {
        id: `${consensusId}-propose-${agentId}`,
        from: 'system',
        to: agentId,
        type: 'consensus',
        timestamp,
        message: {
          phase: 'propose',
          consensusId,
          proposal
        },
        protocol: PROTOCOLS.consensus
      };
      
      this._addToBuffer(envelope);
      
      // Create promise for vote
      const votePromise = new Promise<{ agentId: string; vote: string | null }>((resolve) => {
        this.once(`vote:${consensusId}:${agentId}`, (vote: string) => {
          votes.set(agentId, vote);
          resolve({ agentId, vote });
        });
        
        // Timeout for vote
        setTimeout(() => {
          if (!votes.has(agentId)) {
            votes.set(agentId, null);
            resolve({ agentId, vote: null });
          }
        }, this.config.timeout);
      });
      
      votePromises.push(votePromise);
    });
    
    // Wait for all votes
    await Promise.all(votePromises);
    
    // Phase 2: Tally and decide
    const voteCount: VoteCount = {};
    let totalVotes = 0;
    
    votes.forEach((vote) => {
      if (vote !== null) {
        voteCount[vote] = (voteCount[vote] || 0) + 1;
        totalVotes++;
      }
    });
    
    // Check if consensus reached
    const sortedVotes = Object.entries(voteCount).sort((a, _b) => b[1] - a[1]);
    const winner = sortedVotes[0];
    const consensusReached = winner && 
      (winner[1] / validators.length) >= this.config.consensusQuorum;
    
    const result: ConsensusResult = {
      consensusId,
      proposal,
      validators: validators.length,
      votes: Object.fromEntries(votes),
      voteCount,
      winner: consensusReached ? winner[0] : null,
      consensusReached,
      quorum: this.config.consensusQuorum,
      timestamp: Date.now()
    };
    
    // Phase 3: Announce result
    this.broadcast({
      phase: 'result',
      consensusId,
      result
    }, 'consensus');
    
    this.emit('consensus:completed', result);
    
    return result;
  }
  
  /**
   * Handle incoming message
   */
  handleMessage(envelope: MessageEnvelope): void {
    this.state.metrics.received++;
    
    // Update agent last seen
    const agent = this.state.agents.get(envelope.from);
    if (agent) {
      agent.lastSeen = Date.now();
      agent.messageCount++;
    }
    
    // Decrypt if needed
    if (envelope.encrypted && this.config.encryption) {
      try {
        envelope.message = this._decrypt(envelope.message as EncryptedMessage);
      } catch (error) {
        this.emit('error', { type: 'decryption_failed', envelope, error });
        return;
      }
    }
    
    // Process based on protocol
    switch (envelope.protocol) {
      case PROTOCOLS.direct:
        this._handleDirectMessage(envelope);
        break;
        
      case PROTOCOLS.broadcast:
        this._handleBroadcastMessage(envelope);
        break;
        
      case PROTOCOLS.multicast:
        this._handleMulticastMessage(envelope);
        break;
        
      case PROTOCOLS.gossip:
        this._handleGossipMessage(envelope);
        break;
        
      case PROTOCOLS.consensus:
        this._handleConsensusMessage(envelope);
        break;
        
      default:
        this.emit('error', { type: 'unknown_protocol', envelope });
    }
    
    // Emit general message event
    this.emit('message:received', envelope);
  }
  
  /**
   * Handle direct message
   */
  private _handleDirectMessage(envelope: MessageEnvelope): void {
    // Send acknowledgment
    this._sendAck(envelope.id, envelope.from);
    
    // Emit specific event for message type
    this.emit(`message:${envelope.type}`, envelope);
  }
  
  /**
   * Handle broadcast message
   */
  private _handleBroadcastMessage(envelope: MessageEnvelope): void {
    // No ack for broadcasts
    this.emit(`broadcast:${envelope.type}`, envelope);
  }
  
  /**
   * Handle multicast message
   */
  private _handleMulticastMessage(envelope: MessageEnvelope): void {
    // Send ack to original sender
    if (envelope.groupId) {
      this._sendAck(envelope.groupId, envelope.from);
    }
    
    this.emit(`multicast:${envelope.type}`, envelope);
  }
  
  /**
   * Handle gossip message
   */
  private _handleGossipMessage(envelope: MessageEnvelope): void {
    const gossipMessage = envelope.message as GossipMessage;
    const gossipData = gossipMessage._gossip;
    
    // Check if we've seen this message
    if (gossipData.seen.includes(this.config.swarmId)) {
      return;
    }
    
    // Mark as seen
    gossipData.seen.push(this.config.swarmId);
    gossipData.hops++;
    
    // Process the message
    this.emit(`gossip:${envelope.type}`, envelope);
    
    // Continue spreading if hop count is low
    if (gossipData.hops < 3) {
      const agents = Array.from(this.state.agents.keys())
        .filter(id => !gossipData.seen.includes(id));
      
      const selected = this._selectRandomAgents(agents, this.config.gossipFanout);
      
      selected.forEach(agentId => {
        const newEnvelope: MessageEnvelope = {
          ...envelope,
          id: `${gossipData.originalId}-${agentId}-hop${gossipData.hops}`,
          to: agentId,
          from: this.config.swarmId
        };
        
        this._addToBuffer(newEnvelope);
      });
    }
  }
  
  /**
   * Handle consensus message
   */
  private _handleConsensusMessage(envelope: MessageEnvelope): void {
    const { phase, consensusId } = envelope.message;
    
    switch (phase) {
      case 'propose':
        // Agent should vote on proposal
        this.emit('consensus:proposal', envelope);
        break;
        
      case 'vote':
        // Collect vote
        this.emit(`vote:${consensusId}:${envelope.from}`, envelope.message.vote);
        break;
        
      case 'result':
        // Consensus result announced
        this.emit('consensus:result', envelope.message.result);
        break;
    }
  }
  
  /**
   * Send acknowledgment
   */
  private _sendAck(messageId: string, toAgent: string): void {
    const ack: MessageEnvelope = {
      id: `ack-${messageId}`,
      from: this.config.swarmId,
      to: toAgent,
      type: 'ack',
      timestamp: Date.now(),
      message: { originalId: messageId },
      protocol: PROTOCOLS.direct
    };
    
    this._addToBuffer(ack);
  }
  
  /**
   * Create communication channel
   */
  private _createChannel(agentId: string): CommunicationChannel {
    // In production, this would create actual network channels
    // For now, we simulate with event emitters
    const channel = new EventEmitter() as EventEmitter & CommunicationChannel;
    
    channel.send = (message: any) => {
      this.emit(`channel:${agentId}`, message);
    };
    
    channel.close = () => {
      channel.removeAllListeners();
    };
    
    this.state.channels.set(agentId, channel);
    
    return channel;
  }
  
  /**
   * Add message to buffer
   */
  private _addToBuffer(envelope: MessageEnvelope): void {
    this.state.messageBuffer.push(envelope);
    
    // Limit buffer size
    if (this.state.messageBuffer.length > this.config.bufferSize) {
      const dropped = this.state.messageBuffer.shift();
      if (dropped) {
        this.emit('message:dropped', dropped);
      }
    }
  }
  
  /**
   * Process message buffer
   */
  private _processMessageBuffer(): void {
    const toProcess = this.state.messageBuffer.splice(0, 10);
    
    toProcess.forEach(envelope => {
      // Simulate network delay
      setTimeout(() => {
        if (envelope.to === '*') {
          // Broadcast to all agents
          this.state.agents.forEach((agent) => {
            this.emit(`deliver:${agent.id}`, envelope);
          });
        } else {
          // Direct delivery
          this.emit(`deliver:${envelope.to}`, envelope);
        }
        
        // Update message history
        const history = this.state.messageHistory.get(envelope.id);
        if (history) {
          history.status = 'sent';
          history.sentAt = Date.now();
        }
        
      }, Math.random() * 100);
    });
  }
  
  /**
   * Send heartbeats to all agents
   */
  private _sendHeartbeats(): void {
    const now = Date.now();
    
    this.state.agents.forEach((agent, _agentId) => {
      // Check if agent is still responsive
      if (now - agent.lastSeen > 30000) {
        agent.status = 'offline';
        this.emit('agent:offline', { agentId });
      }
      
      // Send heartbeat
      const heartbeat: MessageEnvelope = {
        id: `heartbeat-${now}-${agentId}`,
        from: 'system',
        to: agentId,
        type: 'heartbeat',
        timestamp: now,
        message: { timestamp: now },
        protocol: PROTOCOLS.direct
      };
      
      this._addToBuffer(heartbeat);
    });
  }
  
  /**
   * Select random agents
   */
  private _selectRandomAgents(agents: string[], count: number): string[] {
    const shuffled = [...agents].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, agents.length));
  }
  
  /**
   * Generate unique message ID
   */
  private _generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Encrypt message
   */
  private _encrypt(data: any): EncryptedMessage {
    if (!this.encryptionKey) return data;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }
  
  /**
   * Decrypt message
   */
  private _decrypt(encrypted: EncryptedMessage): any {
    if (!this.encryptionKey) return encrypted;
    
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
  
  /**
   * Get communication statistics
   */
  getStatistics(): CommunicationStatistics {
    const avgLatency = this.state.metrics.latency.length > 0
      ? this.state.metrics.latency.reduce((a, b) => a + b, 0) / this.state.metrics.latency.length
      : 0;
    
    return {
      agents: {
        total: this.state.agents.size,
        online: Array.from(this.state.agents.values()).filter(a => a.status === 'online').length,
        offline: Array.from(this.state.agents.values()).filter(a => a.status === 'offline').length
      },
      messages: {
        sent: this.state.metrics.sent,
        received: this.state.metrics.received,
        failed: this.state.metrics.failed,
        encrypted: this.state.metrics.encrypted,
        buffered: this.state.messageBuffer.length
      },
      performance: {
        avgLatency: avgLatency.toFixed(2),
        successRate: this.state.metrics.sent > 0 
          ? ((this.state.metrics.sent - this.state.metrics.failed) / this.state.metrics.sent * 100).toFixed(2)
          : '100'
      }
    };
  }
  
  /**
   * Close communication system
   */
  close(): void {
    // Clear timers
    if (this.messageProcessor) clearInterval(this.messageProcessor);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    
    // Close all channels
    this.state.channels.forEach(channel => channel.close());
    
    this.emit('communication:closed');
  }
}