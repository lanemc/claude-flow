/**
 * GitHub API Integration Types
 * Type definitions for GitHub API client, requests, responses, and workflows
 */

// Base GitHub API Response Structure
export interface GitHubAPIResponse<T = any> {
  success: boolean;
  data?: T;
  headers?: Headers;
  status: number;
  error?: string;
}

// Rate Limiting Types
export interface RateLimitInfo {
  remaining: number;
  resetTime: Date | null;
  limit: number;
}

// Repository Types
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    type: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

export interface CreateRepositoryData {
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
}

export interface RepositoryListOptions {
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
  type?: 'all' | 'owner' | 'public' | 'private' | 'member';
  visibility?: 'all' | 'public' | 'private';
  affiliation?: 'owner' | 'collaborator' | 'organization_member';
}

// Pull Request Types
export interface PullRequest {
  id: number;
  number: number;
  state: 'open' | 'closed' | 'merged';
  title: string;
  body: string | null;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  head: {
    ref: string;
    sha: string;
    repo: Repository | null;
  };
  base: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  mergeable: boolean | null;
  mergeable_state: string;
  draft: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface CreatePullRequestData {
  title: string;
  head: string;
  base: string;
  body?: string;
  maintainer_can_modify?: boolean;
  draft?: boolean;
}

export interface UpdatePullRequestData {
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
  maintainer_can_modify?: boolean;
}

export interface MergePullRequestData {
  commit_title?: string;
  commit_message?: string;
  sha?: string;
  merge_method?: 'merge' | 'squash' | 'rebase';
}

export interface RequestReviewData {
  reviewers?: string[];
  team_reviewers?: string[];
}

export interface PullRequestListOptions {
  state?: 'open' | 'closed' | 'all';
  head?: string;
  base?: string;
  sort?: 'created' | 'updated' | 'popularity';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

// Issue Types
export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;
  state: 'open' | 'closed';
  assignees: Array<{
    login: string;
    id: number;
    avatar_url: string;
  }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  comments: number;
}

export interface CreateIssueData {
  title: string;
  body?: string;
  assignees?: string[];
  milestone?: number;
  labels?: string[];
}

export interface UpdateIssueData {
  title?: string;
  body?: string;
  assignees?: string[];
  state?: 'open' | 'closed';
  milestone?: number | null;
  labels?: string[];
}

export interface IssueListOptions {
  milestone?: string | number;
  state?: 'open' | 'closed' | 'all';
  assignee?: string;
  creator?: string;
  mentioned?: string;
  labels?: string;
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'desc';
  since?: string;
  perPage?: number;
  page?: number;
}

// Release Types
export interface Release {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  author: {
    login: string;
    id: number;
    avatar_url: string;
  };
  assets: Array<{
    id: number;
    name: string;
    content_type: string;
    size: number;
    download_count: number;
    browser_download_url: string;
  }>;
  html_url: string;
  upload_url: string;
}

export interface CreateReleaseData {
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  generate_release_notes?: boolean;
}

export interface UpdateReleaseData {
  tag_name?: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
}

export interface ReleaseListOptions {
  perPage?: number;
  page?: number;
}

// Workflow Types
export interface Workflow {
  id: number;
  name: string;
  path: string;
  state: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

export interface WorkflowRun {
  id: number;
  name: string | null;
  head_branch: string;
  head_sha: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflow_id: number;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_attempt: number;
  run_started_at: string;
}

export interface TriggerWorkflowData {
  ref: string;
  inputs?: Record<string, string>;
}

export interface WorkflowRunListOptions {
  actor?: string;
  branch?: string;
  event?: string;
  status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting';
  perPage?: number;
  page?: number;
  created?: string;
  exclude_pull_requests?: boolean;
  check_suite_id?: number;
  head_sha?: string;
}

// Branch Types
export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: {
    enabled: boolean;
    required_status_checks: {
      enforcement_level: string;
      contexts: string[];
    };
  };
  protection_url?: string;
}

export interface CreateBranchData {
  ref: string;
  sha: string;
}

export interface BranchProtection {
  required_status_checks?: {
    strict: boolean;
    contexts: string[];
  } | null;
  enforce_admins?: boolean | null;
  required_pull_request_reviews?: {
    dismiss_stale_reviews?: boolean;
    require_code_owner_reviews?: boolean;
    required_approving_review_count?: number;
    dismissal_restrictions?: {
      users?: string[];
      teams?: string[];
    };
  } | null;
  restrictions?: {
    users: string[];
    teams: string[];
    apps?: string[];
  } | null;
}

// Webhook Types
export interface Webhook {
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    content_type: string;
    secret?: string;
    insecure_ssl?: string;
  };
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  last_response: {
    code: number | null;
    status: string;
    message: string | null;
  };
}

export interface CreateWebhookData {
  name?: string;
  active?: boolean;
  events?: string[];
  config: {
    url: string;
    content_type?: 'json' | 'form';
    secret?: string;
    insecure_ssl?: '0' | '1';
  };
}

export interface UpdateWebhookData {
  config?: {
    url?: string;
    content_type?: 'json' | 'form';
    secret?: string;
    insecure_ssl?: '0' | '1';
  };
  events?: string[];
  add_events?: string[];
  remove_events?: string[];
  active?: boolean;
}

// Event Types for Webhook Processing
export interface WebhookEvent {
  action?: string;
  number?: number;
  pull_request?: PullRequest;
  issue?: Issue;
  release?: Release;
  workflow_run?: WorkflowRun;
  repository?: Repository;
  sender?: {
    login: string;
    id: number;
    avatar_url: string;
  };
  commits?: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
    url: string;
  }>;
  ref?: string;
  before?: string;
  after?: string;
}

export interface ProcessedWebhookEvent {
  handled: boolean;
  event: string;
  action?: string;
  data: WebhookEvent;
}

// User and Authentication Types
export interface User {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  hireable?: boolean | null;
  bio?: string | null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
}

// Request Options Types
export interface GitHubAPIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface PaginationOptions {
  perPage?: number;
  page?: number;
}

export interface SearchOptions extends PaginationOptions {
  sort?: string;
  order?: 'asc' | 'desc';
}

// API Client Configuration
export interface GitHubAPIClientConfig {
  token?: string;
  baseURL?: string;
  timeout?: number;
  retries?: number;
  userAgent?: string;
}

// Error Types
export interface GitHubAPIError extends Error {
  status?: number;
  response?: {
    status: number;
    statusText: string;
    data?: unknown;
  };
}

export class GitHubAuthenticationError extends Error implements GitHubAPIError {
  status = 401;
  
  constructor(message: string = 'GitHub authentication failed') {
    super(message);
    this.name = 'GitHubAuthenticationError';
  }
}

export class GitHubRateLimitError extends Error implements GitHubAPIError {
  status = 403;
  resetTime: Date;
  
  constructor(message: string = 'GitHub rate limit exceeded', resetTime: Date) {
    super(message);
    this.name = 'GitHubRateLimitError';
    this.resetTime = resetTime;
  }
}

export class GitHubNotFoundError extends Error implements GitHubAPIError {
  status = 404;
  
  constructor(message: string = 'GitHub resource not found') {
    super(message);
    this.name = 'GitHubNotFoundError';
  }
}

export class GitHubValidationError extends Error implements GitHubAPIError {
  status = 422;
  
  constructor(message: string = 'GitHub validation failed', public details?: unknown) {
    super(message);
    this.name = 'GitHubValidationError';
  }
}

// Utility Types
export type Awaitable<T> = T | Promise<T>;
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

// Repository parsing utility
export interface ParsedRepository {
  owner: string;
  repo: string;
}

// File operations
export interface FileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

// Search results
export interface SearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

// Common API patterns
export interface ListResponse<T> {
  data: T[];
  total_count?: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

// GraphQL Query Types (for future enhancement)
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, unknown>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

// GitHub App Types (for future enhancement)
export interface GitHubApp {
  id: number;
  slug: string;
  node_id: string;
  owner: User;
  name: string;
  description: string | null;
  external_url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  permissions: Record<string, string>;
  events: string[];
}

export interface Installation {
  id: number;
  account: User;
  repository_selection: 'all' | 'selected';
  access_tokens_url: string;
  repositories_url: string;
  html_url: string;
  app_id: number;
  app_slug: string;
  target_id: number;
  target_type: string;
  permissions: Record<string, string>;
  events: string[];
  created_at: string;
  updated_at: string;
  single_file_name: string | null;
  has_multiple_single_files: boolean;
  single_file_paths: string[];
}

// Team Types
export interface Team {
  id: number;
  node_id: string;
  url: string;
  html_url: string;
  name: string;
  slug: string;
  description: string | null;
  privacy: 'closed' | 'secret';
  permission: string;
  members_url: string;
  repositories_url: string;
  parent: Team | null;
}

// Organization Types
export interface Organization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string | null;
  gravatar_id: string | null;
  name?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  twitter_username?: string | null;
  has_organization_projects: boolean;
  has_repository_projects: boolean;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  type: string;
}

// Statistics and Analytics Types
export interface RepositoryStats {
  size: number;
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  subscribers_count?: number;
  network_count?: number;
}

export interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}

export interface ContributorStats {
  author: User;
  total: number;
  weeks: Array<{
    w: number;
    a: number;
    d: number;
    c: number;
  }>;
}

// Check Types
export interface Check {
  id: number;
  head_sha: string;
  node_id: string;
  external_id: string;
  url: string;
  html_url: string;
  details_url: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  started_at: string;
  completed_at: string | null;
  output: {
    title: string | null;
    summary: string | null;
    text: string | null;
    annotations_count: number;
    annotations_url: string;
  };
  name: string;
  check_suite: {
    id: number;
  };
  app: GitHubApp;
  pull_requests: PullRequest[];
}