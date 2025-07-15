#!/usr/bin/env node
/**
 * GitHub API Integration Module
 * Provides authentication, rate limiting, and API wrappers for GitHub workflow commands
 */

import { printSuccess, printError, printWarning, printInfo } from '../../utils.js';
import {
  GitHubAPIResponse,
  GitHubUser,
  GitHubRepository,
  GitHubPullRequest,
  GitHubIssue,
  GitHubRelease,
  GitHubWorkflow,
  GitHubWorkflowRun,
  GitHubBranch,
  GitHubBranchProtection,
  GitHubWebhook,
  GitHubAPIRequestOptions,
  GitHubListOptions,
  GitHubCreateRepositoryData,
  GitHubCreatePullRequestData,
  GitHubCreateIssueData,
  GitHubCreateReleaseData,
  GitHubMergePullRequestData,
  GitHubRequestReviewData,
  GitHubCreateWebhookData,
  GitHubEventHandler,
  GitHubWebhookEvent,
  GitHubEventType,
  RepositoryIdentifier,
  GitHubWorkflowsResponse,
  GitHubWorkflowRunsResponse,
  NodeCrypto
} from './types.js';

// GitHub API Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RATE_LIMIT = 5000; // API calls per hour
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

class GitHubAPIClient {
  private token: string | null;
  private rateLimitRemaining: number;
  private rateLimitResetTime: Date | null;
  private lastRequestTime: number;
  private requestQueue: Array<() => Promise<any>>;
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
  async authenticate(token: string | null = null): Promise<boolean> {
    if (token) {
      this.token = token;
    }

    if (!this.token) {
      printError('GitHub token not found. Set GITHUB_TOKEN environment variable or provide token.');
      return false;
    }

    try {
      const response = await this.request('/user');
      if (response.success) {
        const userData = response.data as GitHubUser;
        printSuccess(`Authenticated as ${userData.login}`);
        return true;
      }
      return false;
    } catch (error) {
      printError(`Authentication failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Rate Limiting Management
   */
  private async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining <= 1) {
      const resetTime = this.rateLimitResetTime || new Date();
      const now = new Date();
      const waitTime = resetTime.getTime() - now.getTime();
      
      if (waitTime > 0) {
        printWarning(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await this.sleep(waitTime);
      }
    }
  }

  private updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    
    this.rateLimitRemaining = parseInt(remaining || '0');
    this.rateLimitResetTime = new Date(
      (parseInt(reset || '0') || 0) * 1000
    );
  }

  /**
   * Core API Request Method
   */
  async request(endpoint: string, options: GitHubAPIRequestOptions = {}): Promise<GitHubAPIResponse> {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`GitHub API error: ${data.message || response.statusText}`);
      }

      return {
        success: true,
        data,
        headers: response.headers,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        status: (error as any).status || 500
      };
    }
  }

  /**
   * Repository Operations
   */
  async getRepository(owner: string, repo: string): Promise<GitHubAPIResponse<GitHubRepository>> {
    return await this.request(`/repos/${owner}/${repo}`);
  }

  async listRepositories(options: GitHubListOptions = {}): Promise<GitHubAPIResponse<GitHubRepository[]>> {
    const params = new URLSearchParams({
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    return await this.request(`/user/repos?${params}`);
  }

  async createRepository(repoData: GitHubCreateRepositoryData): Promise<GitHubAPIResponse<GitHubRepository>> {
    return await this.request('/user/repos', {
      method: 'POST',
      body: repoData
    });
  }

  /**
   * Pull Request Operations
   */
  async listPullRequests(owner: string, repo: string, options: GitHubListOptions = {}): Promise<GitHubAPIResponse<GitHubPullRequest[]>> {
    const params = new URLSearchParams({
      state: options.state || 'open',
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    return await this.request(`/repos/${owner}/${repo}/pulls?${params}`);
  }

  async createPullRequest(owner: string, repo: string, prData: GitHubCreatePullRequestData): Promise<GitHubAPIResponse<GitHubPullRequest>> {
    return await this.request(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: prData
    });
  }

  async updatePullRequest(owner: string, repo: string, prNumber: number, prData: Partial<GitHubCreatePullRequestData>): Promise<GitHubAPIResponse<GitHubPullRequest>> {
    return await this.request(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
      method: 'PATCH',
      body: prData
    });
  }

  async mergePullRequest(owner: string, repo: string, prNumber: number, mergeData: GitHubMergePullRequestData): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/pulls/${prNumber}/merge`, {
      method: 'PUT',
      body: mergeData
    });
  }

  async requestPullRequestReview(owner: string, repo: string, prNumber: number, reviewData: GitHubRequestReviewData): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`, {
      method: 'POST',
      body: reviewData
    });
  }

  /**
   * Issue Operations
   */
  async listIssues(owner: string, repo: string, options: GitHubListOptions = {}): Promise<GitHubAPIResponse<GitHubIssue[]>> {
    const params = new URLSearchParams({
      state: options.state || 'open',
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.labels) {
      params.append('labels', options.labels);
    }

    return await this.request(`/repos/${owner}/${repo}/issues?${params}`);
  }

  async createIssue(owner: string, repo: string, issueData: GitHubCreateIssueData): Promise<GitHubAPIResponse<GitHubIssue>> {
    return await this.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: issueData
    });
  }

  async updateIssue(owner: string, repo: string, issueNumber: number, issueData: Partial<GitHubCreateIssueData>): Promise<GitHubAPIResponse<GitHubIssue>> {
    return await this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
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
  async listReleases(owner: string, repo: string, options: GitHubListOptions = {}): Promise<GitHubAPIResponse<GitHubRelease[]>> {
    const params = new URLSearchParams({
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    return await this.request(`/repos/${owner}/${repo}/releases?${params}`);
  }

  async createRelease(owner: string, repo: string, releaseData: GitHubCreateReleaseData): Promise<GitHubAPIResponse<GitHubRelease>> {
    return await this.request(`/repos/${owner}/${repo}/releases`, {
      method: 'POST',
      body: releaseData
    });
  }

  async updateRelease(owner: string, repo: string, releaseId: number, releaseData: Partial<GitHubCreateReleaseData>): Promise<GitHubAPIResponse<GitHubRelease>> {
    return await this.request(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      method: 'PATCH',
      body: releaseData
    });
  }

  async deleteRelease(owner: string, repo: string, releaseId: number): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Workflow Operations
   */
  async listWorkflows(owner: string, repo: string): Promise<GitHubAPIResponse<GitHubWorkflowsResponse>> {
    return await this.request(`/repos/${owner}/${repo}/actions/workflows`);
  }

  async triggerWorkflow(owner: string, repo: string, workflowId: string | number, ref: string = 'main', inputs: Record<string, any> = {}): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      body: { ref, inputs }
    });
  }

  async listWorkflowRuns(owner: string, repo: string, options: GitHubListOptions = {}): Promise<GitHubAPIResponse<GitHubWorkflowRunsResponse>> {
    const params = new URLSearchParams({
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString()
    });

    if (options.status) {
      params.append('status', options.status);
    }

    return await this.request(`/repos/${owner}/${repo}/actions/runs?${params}`);
  }

  /**
   * Branch Operations
   */
  async listBranches(owner: string, repo: string): Promise<GitHubAPIResponse<GitHubBranch[]>> {
    return await this.request(`/repos/${owner}/${repo}/branches`);
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

  async getBranchProtection(owner: string, repo: string, branch: string): Promise<GitHubAPIResponse<GitHubBranchProtection>> {
    return await this.request(`/repos/${owner}/${repo}/branches/${branch}/protection`);
  }

  async updateBranchProtection(owner: string, repo: string, branch: string, protection: GitHubBranchProtection): Promise<GitHubAPIResponse<GitHubBranchProtection>> {
    return await this.request(`/repos/${owner}/${repo}/branches/${branch}/protection`, {
      method: 'PUT',
      body: protection
    });
  }

  /**
   * Webhook Operations
   */
  async listWebhooks(owner: string, repo: string): Promise<GitHubAPIResponse<GitHubWebhook[]>> {
    return await this.request(`/repos/${owner}/${repo}/hooks`);
  }

  async createWebhook(owner: string, repo: string, webhookData: GitHubCreateWebhookData): Promise<GitHubAPIResponse<GitHubWebhook>> {
    return await this.request(`/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      body: webhookData
    });
  }

  async updateWebhook(owner: string, repo: string, hookId: number, webhookData: Partial<GitHubCreateWebhookData>): Promise<GitHubAPIResponse<GitHubWebhook>> {
    return await this.request(`/repos/${owner}/${repo}/hooks/${hookId}`, {
      method: 'PATCH',
      body: webhookData
    });
  }

  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<GitHubAPIResponse<any>> {
    return await this.request(`/repos/${owner}/${repo}/hooks/${hookId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Event Processing
   */
  async processWebhookEvent(event: GitHubEventType, signature: string, payload: string): Promise<GitHubEventHandler> {
    if (!this.verifyWebhookSignature(signature, payload)) {
      throw new Error('Invalid webhook signature');
    }

    const eventData: GitHubWebhookEvent = JSON.parse(payload);
    
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
        return { handled: false, event };
    }
  }

  private verifyWebhookSignature(signature: string, payload: string): boolean {
    if (!GITHUB_WEBHOOK_SECRET) {
      printWarning('GITHUB_WEBHOOK_SECRET not set. Skipping signature verification.');
      return true;
    }

    try {
      const crypto = require('crypto') as NodeCrypto;
      const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
      hmac.update(payload);
      const expectedSignature = `sha256=${hmac.digest('hex')}`;
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      printError(`Error verifying webhook signature: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Event Handlers
   */
  private async handlePushEvent(eventData: GitHubWebhookEvent): Promise<GitHubEventHandler> {
    const commits = eventData.commits || [];
    printInfo(`Push event: ${commits.length} commits to ${eventData.ref}`);
    return { handled: true, event: 'push', data: eventData };
  }

  private async handlePullRequestEvent(eventData: GitHubWebhookEvent): Promise<GitHubEventHandler> {
    const action = eventData.action;
    const pr = eventData.pull_request;
    printInfo(`Pull request ${action}: #${pr.number} - ${pr.title}`);
    return { handled: true, event: 'pull_request', action, data: eventData };
  }

  private async handleIssuesEvent(eventData: GitHubWebhookEvent): Promise<GitHubEventHandler> {
    const action = eventData.action;
    const issue = eventData.issue;
    printInfo(`Issue ${action}: #${issue.number} - ${issue.title}`);
    return { handled: true, event: 'issues', action, data: eventData };
  }

  private async handleReleaseEvent(eventData: GitHubWebhookEvent): Promise<GitHubEventHandler> {
    const action = eventData.action;
    const release = eventData.release;
    printInfo(`Release ${action}: ${release.tag_name} - ${release.name}`);
    return { handled: true, event: 'release', action, data: eventData };
  }

  private async handleWorkflowRunEvent(eventData: GitHubWebhookEvent): Promise<GitHubEventHandler> {
    const action = eventData.action;
    const workflowRun = eventData.workflow_run;
    printInfo(`Workflow run ${action}: ${workflowRun.name} - ${workflowRun.conclusion}`);
    return { handled: true, event: 'workflow_run', action, data: eventData };
  }

  /**
   * Utility Methods
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  parseRepository(repoString: string): RepositoryIdentifier {
    const match = repoString.match(/^([^/]+)\/([^/]+)$/);
    if (!match) {
      throw new Error('Invalid repository format. Use: owner/repo');
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
}

// Export singleton instance
export const githubAPI = new GitHubAPIClient();
export default GitHubAPIClient;