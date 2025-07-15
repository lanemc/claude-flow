/**
 * TypeScript type definitions for GitHub API integration
 */

// GitHub API base types
export interface GitHubAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  headers?: Headers;
  status?: number;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubUser;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  default_branch: string;
  language: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  user: GitHubUser;
  head: {
    ref: string;
    sha: string;
    repo: GitHubRepository;
  };
  base: {
    ref: string;
    sha: string;
    repo: GitHubRepository;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  draft: boolean;
  merged: boolean;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: GitHubUser;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  labels: GitHubLabel[];
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string;
  default: boolean;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  author: GitHubUser;
  assets: GitHubReleaseAsset[];
  html_url: string;
}

export interface GitHubReleaseAsset {
  id: number;
  name: string;
  content_type: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

export interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: 'active' | 'deleted' | 'disabled_fork' | 'disabled_inactivity' | 'disabled_manually';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflow_id: number;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: GitHubBranchProtection;
}

export interface GitHubBranchProtection {
  required_status_checks: {
    strict: boolean;
    contexts: string[];
  } | null;
  enforce_admins: boolean;
  required_pull_request_reviews: {
    required_approving_review_count: number;
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
  } | null;
  restrictions: {
    users: GitHubUser[];
    teams: any[];
  } | null;
}

export interface GitHubWebhook {
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    content_type: string;
    insecure_ssl: string;
  };
  created_at: string;
  updated_at: string;
}

// Workflow configuration types
export interface WorkflowConfiguration {
  id: string;
  type: 'ci_pipeline_setup' | 'release_coordination' | 'general_coordination';
  repository: string;
  pipeline?: string;
  version?: string;
  prerelease?: boolean;
  steps: string[];
  status: 'planning' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  objective?: string;
}

export interface RepositoryAnalysis {
  language: string;
  size: number;
  defaultBranch: string;
  hasWorkflows: boolean;
  hasTests: boolean;
  hasPackageJson: boolean;
}

// Event handler types
export interface GitHubEventHandler {
  handled: boolean;
  event: string;
  action?: string;
  data?: any;
}

export interface GitHubWebhookEvent {
  action: string;
  [key: string]: any;
}

// API request options
export interface GitHubAPIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export interface GitHubListOptions {
  state?: 'open' | 'closed' | 'all';
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
  per_page?: number;
  labels?: string;
  status?: string;
}

export interface GitHubCreateRepositoryData {
  name: string;
  description?: string;
  homepage?: string;
  private?: boolean;
  has_issues?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  allow_squash_merge?: boolean;
  allow_merge_commit?: boolean;
  allow_rebase_merge?: boolean;
}

export interface GitHubCreatePullRequestData {
  title: string;
  body?: string;
  head: string;
  base: string;
  maintainer_can_modify?: boolean;
  draft?: boolean;
}

export interface GitHubCreateIssueData {
  title: string;
  body?: string;
  assignees?: string[];
  milestone?: number;
  labels?: string[];
}

export interface GitHubCreateReleaseData {
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  generate_release_notes?: boolean;
}

export interface GitHubMergePullRequestData {
  commit_title?: string;
  commit_message?: string;
  merge_method?: 'merge' | 'squash' | 'rebase';
}

export interface GitHubRequestReviewData {
  reviewers?: string[];
  team_reviewers?: string[];
}

export interface GitHubCreateWebhookData {
  name: string;
  active?: boolean;
  events?: string[];
  config: {
    url: string;
    content_type?: string;
    secret?: string;
    insecure_ssl?: string;
  };
}

export interface GitHubSecretRecommendation {
  name: string;
  description: string;
}

// Coordinator types
export interface CoordinatorOptions {
  token?: string;
  pipeline?: string;
  autoApprove?: boolean;
  version?: string;
  prerelease?: boolean;
}

export interface CoordinatorState {
  currentRepo?: {
    owner: string;
    repo: string;
  };
  swarmEnabled: boolean;
  workflows: Map<string, WorkflowConfiguration>;
  activeCoordinations: Map<string, WorkflowConfiguration>;
}

// Template types for workflow generation
export interface WorkflowTemplate {
  nodejs: string;
  python: string;
  docker: string;
}

// Error types
export interface GitHubAPIError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

// Rate limiting types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

// List response types
export interface GitHubListResponse<T> {
  total_count?: number;
  items?: T[];
  [key: string]: any;
}

export interface GitHubWorkflowsResponse {
  total_count: number;
  workflows: GitHubWorkflow[];
}

export interface GitHubWorkflowRunsResponse {
  total_count: number;
  workflow_runs: GitHubWorkflowRun[];
}

// Utility types
export type GitHubEventType = 'push' | 'pull_request' | 'issues' | 'release' | 'workflow_run';

export interface RepositoryIdentifier {
  owner: string;
  repo: string;
}

export interface CreateFileData {
  message: string;
  content: string;
  path: string;
  sha?: string;
}

export interface NodeCrypto {
  createHmac(algorithm: string, key: string): {
    update(data: string): void;
    digest(encoding: string): string;
  };
  timingSafeEqual(a: Buffer, b: Buffer): boolean;
}