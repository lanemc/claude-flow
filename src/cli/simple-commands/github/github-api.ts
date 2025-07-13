#!/usr/bin/env node
/**
 * GitHub API Integration Module
 * Provides authentication, rate limiting, and API wrappers for GitHub workflow commands
 */

import { 
  GitHubAPIResponse,
  GitHubAPIRequestOptions,
  RateLimitInfo,
  Repository,
  CreateRepositoryData,
  RepositoryListOptions,
  PullRequest,
  CreatePullRequestData,
  UpdatePullRequestData,
  MergePullRequestData,
  RequestReviewData,
  PullRequestListOptions,
  Issue,
  CreateIssueData,
  UpdateIssueData,
  IssueListOptions,
  Release,
  CreateReleaseData,
  UpdateReleaseData,
  ReleaseListOptions,
  Workflow,
  WorkflowRun,
  TriggerWorkflowData,
  WorkflowRunListOptions,
  Branch,
  CreateBranchData,
  BranchProtection,
  Webhook,
  CreateWebhookData,
  UpdateWebhookData,
  WebhookEvent,
  ProcessedWebhookEvent,
  User,
  ParsedRepository,
  GitHubAPIError as GitHubAPIErrorType,
  GitHubAuthenticationError,
  GitHubRateLimitError,
  GitHubNotFoundError,
  GitHubValidationError,
  Awaitable
} from './types';

// Utility functions for console output
interface PrintFunctions {
  printSuccess: (message: string) => void;
  printError: (message: string) => void;
  printWarning: (message: string) => void;
  printInfo: (message: string) => void;
}

// Mock print functions - these would be imported from utils.js
const mockPrintFunctions: PrintFunctions = {
  printSuccess: (message: string) => console.log(`✅ ${message}`),
  printError: (message: string) => console.error(`❌ ${message}`),
  printWarning: (message: string) => console.warn(`⚠️ ${message}`),
  printInfo: (message: string) => console.info(`ℹ️ ${message}`)
};

const { printSuccess, printError, printWarning, printInfo } = mockPrintFunctions;

// GitHub API Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RATE_LIMIT = 5000; // API calls per hour
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

export class GitHubAPIClient {
  private token: string | null;
  private rateLimitRemaining: number;
  private rateLimitResetTime: Date | null;
  private lastRequestTime: number;
  private requestQueue: Array<() => Promise<void>>;
  private isProcessingQueue: boolean;

  constructor(token: string | null = null) {
    this.token = token || process.env.GITHUB_TOKEN || null;
    this.rateLimitRemaining = GITHUB_RATE_LIMIT;
    this.rateLimitResetTime = null;
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Authentication Methods
   */
  async authenticate(token?: string): Promise<boolean> {
    if (token) {
      this.token = token;
    }

    if (!this.token) {
      printError('GitHub token not found. Set GITHUB_TOKEN environment variable or provide token.');
      return false;
    }

    try {
      const response = await this.request<User>('/user');
      if (response.success && response.data) {
        printSuccess(`Authenticated as ${response.data.login}`);
        return true;
      }
      return false;
    } catch (error) {
      const err = error as GitHubAPIError;
      printError(`Authentication failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Rate Limiting Management
   */
  private async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining <= 1) {
      const resetTime = this.rateLimitResetTime;
      const now = new Date();
      
      if (resetTime) {
        const waitTime = resetTime.getTime() - now.getTime();
        
        if (waitTime > 0) {
          printWarning(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s...`);
          await this.sleep(waitTime);
        }
      }
    }
  }

  private updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    
    this.rateLimitRemaining = remaining ? parseInt(remaining) : 0;
    this.rateLimitResetTime = reset ? new Date(parseInt(reset) * 1000) : null;
  }

  /**
   * Core API Request Method
   */
  async request<T = any>(endpoint: string, options: GitHubAPIRequestOptions = {}): Promise<GitHubAPIResponse<T>> {
    await this.checkRateLimit();

    const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Claude-Flow-GitHub-Integration',
      ...options.headers
    };

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, requestOptions);
      this.updateRateLimitInfo(response.headers);

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json() as T;
      } else {
        data = await response.text() as T;
      }

      if (!response.ok) {
        const errorData = data as any;
        throw new GitHubAPIError(`GitHub API error: ${errorData.message || response.statusText}`);
      }

      return {
        success: true,
        data,
        headers: response.headers,
        status: response.status
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: err.message,
        status: 500
      };
    }
  }

  /**
   * Repository Operations
   */
  async getRepository(owner: string, repo: string): Promise<GitHubAPIResponse<Repository>> {
    return await this.request<Repository>(`/repos/${owner}/${repo}`);
  }

  async listRepositories(options: RepositoryListOptions = {}): Promise<GitHubAPIResponse<Repository[]>> {
    const params = new URLSearchParams({
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.type) params.append('type', options.type);
    if (options.visibility) params.append('visibility', options.visibility);
    if (options.affiliation) params.append('affiliation', options.affiliation);

    return await this.request<Repository[]>(`/user/repos?${params}`);
  }

  async createRepository(repoData: CreateRepositoryData): Promise<GitHubAPIResponse<Repository>> {
    return await this.request<Repository>('/user/repos', {
      method: 'POST',
      body: repoData
    });
  }

  /**
   * Pull Request Operations
   */
  async listPullRequests(owner: string, repo: string, options: PullRequestListOptions = {}): Promise<GitHubAPIResponse<PullRequest[]>> {
    const params = new URLSearchParams({
      state: options.state || 'open',
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.head) params.append('head', options.head);
    if (options.base) params.append('base', options.base);

    return await this.request<PullRequest[]>(`/repos/${owner}/${repo}/pulls?${params}`);
  }

  async createPullRequest(owner: string, repo: string, prData: CreatePullRequestData): Promise<GitHubAPIResponse<PullRequest>> {
    return await this.request<PullRequest>(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: prData
    });
  }

  async updatePullRequest(owner: string, repo: string, prNumber: number, prData: UpdatePullRequestData): Promise<GitHubAPIResponse<PullRequest>> {
    return await this.request<PullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
      method: 'PATCH',
      body: prData
    });
  }

  async mergePullRequest(owner: string, repo: string, prNumber: number, mergeData: MergePullRequestData): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/pulls/${prNumber}/merge`, {
      method: 'PUT',
      body: mergeData
    });
  }

  async requestPullRequestReview(owner: string, repo: string, prNumber: number, reviewData: RequestReviewData): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`, {
      method: 'POST',
      body: reviewData
    });
  }

  /**
   * Issue Operations
   */
  async listIssues(owner: string, repo: string, options: IssueListOptions = {}): Promise<GitHubAPIResponse<Issue[]>> {
    const params = new URLSearchParams({
      state: options.state || 'open',
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.labels) params.append('labels', options.labels);
    if (options.assignee) params.append('assignee', options.assignee);
    if (options.creator) params.append('creator', options.creator);
    if (options.mentioned) params.append('mentioned', options.mentioned);
    if (options.milestone !== undefined) params.append('milestone', options.milestone.toString());
    if (options.since) params.append('since', options.since);

    return await this.request<Issue[]>(`/repos/${owner}/${repo}/issues?${params}`);
  }

  async createIssue(owner: string, repo: string, issueData: CreateIssueData): Promise<GitHubAPIResponse<Issue>> {
    return await this.request<Issue>(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: issueData
    });
  }

  async updateIssue(owner: string, repo: string, issueNumber: number, issueData: UpdateIssueData): Promise<GitHubAPIResponse<Issue>> {
    return await this.request<Issue>(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: issueData
    });
  }

  async addIssueLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/issues/${issueNumber}/labels`, {
      method: 'POST',
      body: { labels }
    });
  }

  async assignIssue(owner: string, repo: string, issueNumber: number, assignees: string[]): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/issues/${issueNumber}/assignees`, {
      method: 'POST',
      body: { assignees }
    });
  }

  /**
   * Release Operations
   */
  async listReleases(owner: string, repo: string, options: ReleaseListOptions = {}): Promise<GitHubAPIResponse<Release[]>> {
    const params = new URLSearchParams({
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    return await this.request<Release[]>(`/repos/${owner}/${repo}/releases?${params}`);
  }

  async createRelease(owner: string, repo: string, releaseData: CreateReleaseData): Promise<GitHubAPIResponse<Release>> {
    return await this.request<Release>(`/repos/${owner}/${repo}/releases`, {
      method: 'POST',
      body: releaseData
    });
  }

  async updateRelease(owner: string, repo: string, releaseId: number, releaseData: UpdateReleaseData): Promise<GitHubAPIResponse<Release>> {
    return await this.request<Release>(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      method: 'PATCH',
      body: releaseData
    });
  }

  async deleteRelease(owner: string, repo: string, releaseId: number): Promise<GitHubAPIResponse<void>> {
    return await this.request<void>(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Workflow Operations
   */
  async listWorkflows(owner: string, repo: string): Promise<GitHubAPIResponse<{ workflows: Workflow[] }>> {
    return await this.request<{ workflows: Workflow[] }>(`/repos/${owner}/${repo}/actions/workflows`);
  }

  async triggerWorkflow(owner: string, repo: string, workflowId: number | string, data: TriggerWorkflowData): Promise<GitHubAPIResponse<void>> {
    return await this.request<void>(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      body: data
    });
  }

  async listWorkflowRuns(owner: string, repo: string, options: WorkflowRunListOptions = {}): Promise<GitHubAPIResponse<{ workflow_runs: WorkflowRun[] }>> {
    const params = new URLSearchParams({
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.actor) params.append('actor', options.actor);
    if (options.branch) params.append('branch', options.branch);
    if (options.event) params.append('event', options.event);
    if (options.status) params.append('status', options.status);
    if (options.created) params.append('created', options.created);
    if (options.exclude_pull_requests) params.append('exclude_pull_requests', 'true');
    if (options.check_suite_id) params.append('check_suite_id', options.check_suite_id.toString());
    if (options.head_sha) params.append('head_sha', options.head_sha);

    return await this.request<{ workflow_runs: WorkflowRun[] }>(`/repos/${owner}/${repo}/actions/runs?${params}`);
  }

  /**
   * Branch Operations
   */
  async listBranches(owner: string, repo: string): Promise<GitHubAPIResponse<Branch[]>> {
    return await this.request<Branch[]>(`/repos/${owner}/${repo}/branches`);
  }

  async createBranch(owner: string, repo: string, branchName: string, sha: string): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: {
        ref: `refs/heads/${branchName}`,
        sha
      }
    });
  }

  async getBranchProtection(owner: string, repo: string, branch: string): Promise<GitHubAPIResponse<BranchProtection>> {
    return await this.request<BranchProtection>(`/repos/${owner}/${repo}/branches/${branch}/protection`);
  }

  async updateBranchProtection(owner: string, repo: string, branch: string, protection: BranchProtection): Promise<GitHubAPIResponse<BranchProtection>> {
    return await this.request<BranchProtection>(`/repos/${owner}/${repo}/branches/${branch}/protection`, {
      method: 'PUT',
      body: protection
    });
  }

  /**
   * Webhook Operations
   */
  async listWebhooks(owner: string, repo: string): Promise<GitHubAPIResponse<Webhook[]>> {
    return await this.request<Webhook[]>(`/repos/${owner}/${repo}/hooks`);
  }

  async createWebhook(owner: string, repo: string, webhookData: CreateWebhookData): Promise<GitHubAPIResponse<Webhook>> {
    return await this.request<Webhook>(`/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      body: webhookData
    });
  }

  async updateWebhook(owner: string, repo: string, hookId: number, webhookData: UpdateWebhookData): Promise<GitHubAPIResponse<Webhook>> {
    return await this.request<Webhook>(`/repos/${owner}/${repo}/hooks/${hookId}`, {
      method: 'PATCH',
      body: webhookData
    });
  }

  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<GitHubAPIResponse<void>> {
    return await this.request<void>(`/repos/${owner}/${repo}/hooks/${hookId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Event Processing
   */
  async processWebhookEvent(event: string, signature: string, payload: string): Promise<ProcessedWebhookEvent> {
    if (!this.verifyWebhookSignature(signature, payload)) {
      throw new GitHubValidationError('Invalid webhook signature');
    }

    const eventData: WebhookEvent = JSON.parse(payload);
    
    switch (event) {
      case 'push':
        return this.handlePushEvent(eventData);
      case 'pull_request':
        return this.handlePullRequestEvent(eventData);
      case 'issues':
        return this.handleIssuesEvent(eventData);
      case 'release':
        return this.handleReleaseEvent(eventData);
      case 'workflow_run':
        return this.handleWorkflowRunEvent(eventData);
      default:
        printInfo(`Unhandled event type: ${event}`);
        return { handled: false, event, data: eventData };
    }
  }

  private verifyWebhookSignature(signature: string, payload: string): boolean {
    if (!GITHUB_WEBHOOK_SECRET) {
      printWarning('GITHUB_WEBHOOK_SECRET not set. Skipping signature verification.');
      return true;
    }

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    hmac.update(payload);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Event Handlers
   */
  private handlePushEvent(eventData: WebhookEvent): ProcessedWebhookEvent {
    const commitCount = eventData.commits?.length || 0;
    printInfo(`Push event: ${commitCount} commits to ${eventData.ref}`);
    return { handled: true, event: 'push', data: eventData };
  }

  private handlePullRequestEvent(eventData: WebhookEvent): ProcessedWebhookEvent {
    const action = eventData.action;
    const pr = eventData.pull_request;
    if (pr) {
      printInfo(`Pull request ${action}: #${pr.number} - ${pr.title}`);
    }
    return { handled: true, event: 'pull_request', action, data: eventData };
  }

  private handleIssuesEvent(eventData: WebhookEvent): ProcessedWebhookEvent {
    const action = eventData.action;
    const issue = eventData.issue;
    if (issue) {
      printInfo(`Issue ${action}: #${issue.number} - ${issue.title}`);
    }
    return { handled: true, event: 'issues', action, data: eventData };
  }

  private handleReleaseEvent(eventData: WebhookEvent): ProcessedWebhookEvent {
    const action = eventData.action;
    const release = eventData.release;
    if (release) {
      printInfo(`Release ${action}: ${release.tag_name} - ${release.name}`);
    }
    return { handled: true, event: 'release', action, data: eventData };
  }

  private handleWorkflowRunEvent(eventData: WebhookEvent): ProcessedWebhookEvent {
    const action = eventData.action;
    const workflowRun = eventData.workflow_run;
    if (workflowRun) {
      printInfo(`Workflow run ${action}: ${workflowRun.name} - ${workflowRun.conclusion}`);
    }
    return { handled: true, event: 'workflow_run', action, data: eventData };
  }

  /**
   * Utility Methods
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  parseRepository(repoString: string): ParsedRepository {
    const match = repoString.match(/^([^/]+)\/([^/]+)$/);
    if (!match) {
      throw new GitHubValidationError('Invalid repository format. Use: owner/repo');
    }
    return { owner: match[1], repo: match[2] };
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  // Rate limit information getter
  getRateLimitInfo(): RateLimitInfo {
    return {
      remaining: this.rateLimitRemaining,
      resetTime: this.rateLimitResetTime,
      limit: GITHUB_RATE_LIMIT
    };
  }

  // Token validation
  hasValidToken(): boolean {
    return Boolean(this.token);
  }

  // Set new token
  setToken(token: string): void {
    this.token = token;
  }

  // Clear token
  clearToken(): void {
    this.token = null;
  }
}

// GitHub API Error class
class GitHubAPIError extends Error implements GitHubAPIError {
  status?: number;
  response?: {
    status: number;
    statusText: string;
    data?: any;
  };

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GitHubAPIError';
    this.status = status;
  }
}

// Export singleton instance
export const githubAPI = new GitHubAPIClient();
export default GitHubAPIClient;

// Re-export types for convenience
export type {
  Repository,
  PullRequest,
  Issue,
  Release,
  Workflow,
  WorkflowRun,
  Branch,
  Webhook,
  User,
  WebhookEvent,
  ProcessedWebhookEvent,
  GitHubAPIResponse,
  CreateRepositoryData,
  CreatePullRequestData,
  CreateIssueData,
  CreateReleaseData,
  CreateWebhookData,
  RepositoryListOptions,
  PullRequestListOptions,
  IssueListOptions,
  ReleaseListOptions,
  WorkflowRunListOptions,
  BranchProtection,
  ParsedRepository,
  RateLimitInfo
};