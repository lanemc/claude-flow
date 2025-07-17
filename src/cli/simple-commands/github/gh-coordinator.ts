#!/usr/bin/env node
/**
 * GitHub Coordinator Command
 * Provides GitHub workflow orchestration and coordination capabilities
 */

import { printSuccess, printError, printWarning, printInfo } from '../../utils.js';
import { githubAPI } from './github-api.js';
import { execSync } from 'child_process';
import {
  WorkflowConfiguration,
  RepositoryAnalysis,
  CoordinatorOptions,
  CoordinatorState,
  WorkflowTemplate,
  GitHubSecretRecommendation,
  GitHubBranchProtection,
  GitHubCreateWebhookData,
  GitHubRepository,
  GitHubWorkflowsResponse,
  GitHubWorkflowRunsResponse,
  CreateFileData,
  RepositoryIdentifier
} from './types.js';

class GitHubCoordinator {
  private api: typeof githubAPI;
  public state: CoordinatorState;

  constructor() {
    this.api = githubAPI;
    this.state = {
      swarmEnabled: false,
      workflows: new Map<string, WorkflowConfiguration>(),
      activeCoordinations: new Map<string, WorkflowConfiguration>()
    };
  }

  /**
   * Initialize GitHub coordination
   */
  async initialize(options: CoordinatorOptions = {}): Promise<void> {
    printInfo('🚀 Initializing GitHub Coordinator...');
    
    // Authenticate with GitHub
    const authenticated = await this.api.authenticate(options.token);
    if (!authenticated) {
      throw new Error('Failed to authenticate with GitHub');
    }

    // Check if we're in a git repository
    try {
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      
      if (repoMatch) {
        this.state.currentRepo = { owner: repoMatch[1], repo: repoMatch[2] };
        printSuccess(`Connected to repository: ${this.state.currentRepo.owner}/${this.state.currentRepo.repo}`);
      }
    } catch (error) {
      printWarning('Not in a git repository or no GitHub remote found');
    }

    // Initialize swarm integration
    await this.initializeSwarmIntegration();

    printSuccess('✅ GitHub Coordinator initialized successfully');
  }

  /**
   * Initialize swarm integration for coordination
   */
  private async initializeSwarmIntegration(): Promise<void> {
    try {
      // Check if ruv-swarm is available
      execSync('npx ruv-swarm --version', { stdio: 'pipe' });
      
      // Initialize swarm for GitHub coordination
      const swarmInit = execSync('npx ruv-swarm hook pre-task --description "GitHub workflow coordination"', 
        { encoding: 'utf8' });
      
      if (swarmInit.includes('continue')) {
        printSuccess('🐝 Swarm integration initialized for GitHub coordination');
        this.state.swarmEnabled = true;
      }
    } catch (error) {
      printWarning('Swarm integration not available - continuing without swarm features');
      this.state.swarmEnabled = false;
    }
  }

  /**
   * Coordinate CI/CD pipeline setup
   */
  async coordinateCIPipeline(options: CoordinatorOptions = {}): Promise<WorkflowConfiguration> {
    printInfo('🔄 Coordinating CI/CD pipeline setup...');
    
    if (!this.state.currentRepo) {
      throw new Error('No GitHub repository context available');
    }

    const { owner, repo } = this.state.currentRepo;
    const pipeline = options.pipeline || 'nodejs';
    const autoApprove = options.autoApprove || false;

    // Create workflow coordination plan
    const coordinationPlan: WorkflowConfiguration = {
      id: `ci-setup-${Date.now()}`,
      type: 'ci_pipeline_setup',
      repository: `${owner}/${repo}`,
      pipeline,
      steps: [
        'analyze_repository_structure',
        'create_workflow_files',
        'setup_environment_secrets',
        'configure_branch_protection',
        'test_pipeline_execution',
        'setup_notifications'
      ],
      status: 'planning'
    };

    this.state.activeCoordinations.set(coordinationPlan.id, coordinationPlan);

    // Execute coordination with swarm if available
    if (this.state.swarmEnabled) {
      await this.executeWithSwarm(coordinationPlan);
    } else {
      await this.executeCoordination(coordinationPlan);
    }

    return coordinationPlan;
  }

  /**
   * Execute coordination with swarm integration
   */
  public async executeWithSwarm(coordinationPlan: WorkflowConfiguration): Promise<void> {
    printInfo('🐝 Executing coordination with swarm...');
    
    // Store coordination plan in swarm memory
    const memoryKey = `github-coordination/${coordinationPlan.id}`;
    execSync(`npx ruv-swarm hook notification --message "GitHub Coordination: ${coordinationPlan.type} started" --telemetry true`);
    
    // Execute each step with swarm coordination
    for (const step of coordinationPlan.steps) {
      printInfo(`Executing step: ${step}`);
      
      // Pre-step hook
      execSync(`npx ruv-swarm hook pre-task --description "GitHub step: ${step}"`);
      
      // Execute step
      await this.executeCoordinationStep(coordinationPlan, step);
      
      // Post-step hook
      execSync(`npx ruv-swarm hook post-edit --file "github-coordination" --memory-key "${memoryKey}/${step}"`);
    }

    // Final coordination notification
    execSync(`npx ruv-swarm hook notification --message "GitHub Coordination: ${coordinationPlan.type} completed" --telemetry true`);
  }

  /**
   * Execute coordination without swarm
   */
  public async executeCoordination(coordinationPlan: WorkflowConfiguration): Promise<void> {
    printInfo('⚡ Executing coordination...');
    
    for (const step of coordinationPlan.steps) {
      printInfo(`Executing step: ${step}`);
      await this.executeCoordinationStep(coordinationPlan, step);
    }
  }

  /**
   * Execute individual coordination step
   */
  private async executeCoordinationStep(coordinationPlan: WorkflowConfiguration, step: string): Promise<void> {
    if (!this.state.currentRepo) {
      throw new Error('No repository context available');
    }

    const { owner, repo } = this.state.currentRepo;
    
    switch (step) {
      case 'analyze_repository_structure':
        await this.analyzeRepositoryStructure(owner, repo);
        break;
      case 'create_workflow_files':
        await this.createWorkflowFiles(owner, repo, coordinationPlan.pipeline || 'nodejs');
        break;
      case 'setup_environment_secrets':
        await this.setupEnvironmentSecrets(owner, repo);
        break;
      case 'configure_branch_protection':
        await this.configureBranchProtection(owner, repo);
        break;
      case 'test_pipeline_execution':
        await this.testPipelineExecution(owner, repo);
        break;
      case 'setup_notifications':
        await this.setupNotifications(owner, repo);
        break;
      default:
        printWarning(`Unknown coordination step: ${step}`);
    }
  }

  /**
   * Analyze repository structure
   */
  private async analyzeRepositoryStructure(owner: string, repo: string): Promise<RepositoryAnalysis> {
    printInfo('📊 Analyzing repository structure...');
    
    const response = await this.api.getRepository(owner, repo);
    if (!response.success) {
      throw new Error(`Failed to get repository info: ${response.error}`);
    }

    const repoData = response.data as GitHubRepository;
    const analysis: RepositoryAnalysis = {
      language: repoData.language,
      size: repoData.size,
      defaultBranch: repoData.default_branch,
      hasWorkflows: false,
      hasTests: false,
      hasPackageJson: false
    };

    // Check for existing workflows
    const workflowsResponse = await this.api.listWorkflows(owner, repo);
    if (workflowsResponse.success) {
      const workflowsData = workflowsResponse.data as GitHubWorkflowsResponse;
      analysis.hasWorkflows = workflowsData.total_count > 0;
    }

    // Check for package.json (Node.js projects)
    try {
      const packageResponse = await this.api.request(`/repos/${owner}/${repo}/contents/package.json`);
      analysis.hasPackageJson = packageResponse.success;
    } catch (error) {
      // package.json doesn't exist
    }

    printSuccess(`✅ Repository analysis complete: ${analysis.language} project`);
    return analysis;
  }

  /**
   * Create workflow files
   */
  private async createWorkflowFiles(owner: string, repo: string, pipeline: string): Promise<void> {
    printInfo('📝 Creating workflow files...');
    
    const workflowContent = this.generateWorkflowContent(pipeline);
    const workflowPath = `.github/workflows/${pipeline}-ci.yml`;
    
    // Create workflow file content
    const createFileData: CreateFileData = {
      message: `Add ${pipeline} CI workflow`,
      content: Buffer.from(workflowContent).toString('base64'),
      path: workflowPath
    };

    // Check if file exists
    const existingFile = await this.api.request(`/repos/${owner}/${repo}/contents/${workflowPath}`);
    if (existingFile.success) {
      // Update existing file
      createFileData.sha = existingFile.data.sha;
      createFileData.message = `Update ${pipeline} CI workflow`;
    }

    const response = await this.api.request(`/repos/${owner}/${repo}/contents/${workflowPath}`, {
      method: 'PUT',
      body: createFileData
    });

    if (response.success) {
      printSuccess(`✅ Workflow file created: ${workflowPath}`);
    } else {
      throw new Error(`Failed to create workflow file: ${response.error}`);
    }
  }

  /**
   * Generate workflow content based on pipeline type
   */
  private generateWorkflowContent(pipeline: string): string {
    const templates: WorkflowTemplate = {
      nodejs: `name: Node.js CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linter
      run: npm run lint
      
    - name: Build project
      run: npm run build
      
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level moderate
      
    - name: Check for vulnerabilities
      run: npm audit --audit-level high
`,
      
      python: `name: Python CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: [3.8, 3.9, 3.10, 3.11]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: \${{ matrix.python-version }}
        
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install pytest pytest-cov
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
        
    - name: Run tests
      run: pytest --cov=./ --cov-report=xml
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
`,
      
      docker: `name: Docker CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t app .
      
    - name: Run container tests
      run: docker run --rm app npm test
      
    - name: Security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'app'
        format: 'sarif'
        output: 'trivy-results.sarif'
`
    };

    return templates[pipeline as keyof WorkflowTemplate] || templates.nodejs;
  }

  /**
   * Setup environment secrets
   */
  private async setupEnvironmentSecrets(owner: string, repo: string): Promise<void> {
    printInfo('🔐 Setting up environment secrets...');
    
    const secrets: GitHubSecretRecommendation[] = [
      { name: 'NODE_ENV', description: 'Node.js environment' },
      { name: 'DATABASE_URL', description: 'Database connection string' },
      { name: 'API_KEY', description: 'API authentication key' }
    ];

    printInfo('Recommended secrets to configure:');
    secrets.forEach(secret => {
      console.log(`  - ${secret.name}: ${secret.description}`);
    });

    printWarning('Note: Secrets must be configured manually in GitHub repository settings');
    printSuccess('✅ Environment secrets guidance provided');
  }

  /**
   * Configure branch protection
   */
  private async configureBranchProtection(owner: string, repo: string): Promise<void> {
    printInfo('🛡️  Configuring branch protection...');
    
    const protectionConfig: GitHubBranchProtection = {
      required_status_checks: {
        strict: true,
        contexts: ['test']
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false
      },
      restrictions: null
    };

    const response = await this.api.updateBranchProtection(owner, repo, 'main', protectionConfig);
    
    if (response.success) {
      printSuccess('✅ Branch protection configured for main branch');
    } else {
      printWarning(`⚠️  Failed to configure branch protection: ${response.error}`);
    }
  }

  /**
   * Test pipeline execution
   */
  private async testPipelineExecution(owner: string, repo: string): Promise<void> {
    printInfo('🧪 Testing pipeline execution...');
    
    const workflows = await this.api.listWorkflows(owner, repo);
    if (!workflows.success) {
      printWarning('No workflows found to test');
      return;
    }

    const recentRuns = await this.api.listWorkflowRuns(owner, repo, { per_page: 5 });
    if (recentRuns.success) {
      const runsData = recentRuns.data as GitHubWorkflowRunsResponse;
      printInfo(`Found ${runsData.total_count} recent workflow runs`);
      
      const latestRun = runsData.workflow_runs[0];
      if (latestRun) {
        printInfo(`Latest run: ${latestRun.conclusion} (${latestRun.status})`);
      }
    }

    printSuccess('✅ Pipeline execution status checked');
  }

  /**
   * Setup notifications
   */
  private async setupNotifications(owner: string, repo: string): Promise<void> {
    printInfo('📢 Setting up notifications...');
    
    const webhookConfig: GitHubCreateWebhookData = {
      name: 'web',
      active: true,
      events: ['push', 'pull_request', 'issues', 'workflow_run'],
      config: {
        url: 'https://your-webhook-url.com/github',
        content_type: 'json',
        insecure_ssl: '0'
      }
    };

    printInfo('Webhook configuration template:');
    console.log(JSON.stringify(webhookConfig, null, 2));
    
    printWarning('Note: Webhook URL must be configured with your actual endpoint');
    printSuccess('✅ Notification setup guidance provided');
  }

  /**
   * Coordinate release process
   */
  async coordinateRelease(options: CoordinatorOptions = {}): Promise<WorkflowConfiguration> {
    printInfo('🚀 Coordinating release process...');
    
    if (!this.state.currentRepo) {
      throw new Error('No GitHub repository context available');
    }

    const { owner, repo } = this.state.currentRepo;
    const version = options.version || 'auto';
    const prerelease = options.prerelease || false;

    const coordinationPlan: WorkflowConfiguration = {
      id: `release-${Date.now()}`,
      type: 'release_coordination',
      repository: `${owner}/${repo}`,
      version,
      prerelease,
      steps: [
        'prepare_release_notes',
        'create_release_branch',
        'run_release_tests',
        'create_release_tag',
        'publish_release',
        'notify_stakeholders'
      ],
      status: 'planning'
    };

    this.state.activeCoordinations.set(coordinationPlan.id, coordinationPlan);

    if (this.state.swarmEnabled) {
      await this.executeWithSwarm(coordinationPlan);
    } else {
      await this.executeCoordination(coordinationPlan);
    }

    return coordinationPlan;
  }

  /**
   * Get coordination status
   */
  getCoordinationStatus(coordinationId: string): WorkflowConfiguration | null {
    return this.state.activeCoordinations.get(coordinationId) || null;
  }

  /**
   * List active coordinations
   */
  listActiveCoordinations(): WorkflowConfiguration[] {
    return Array.from(this.state.activeCoordinations.values());
  }

  /**
   * Cancel coordination
   */
  cancelCoordination(coordinationId: string): boolean {
    const coordination = this.state.activeCoordinations.get(coordinationId);
    if (coordination) {
      coordination.status = 'cancelled';
      this.state.activeCoordinations.delete(coordinationId);
      printSuccess(`✅ Coordination ${coordinationId} cancelled`);
      return true;
    }
    return false;
  }
}

// Export coordination function
export async function coordinateGitHubWorkflow(args: string[], flags: CoordinatorOptions = {}): Promise<WorkflowConfiguration> {
  const coordinator = new GitHubCoordinator();
  
  try {
    await coordinator.initialize(flags);
    
    const objective = args.join(' ').trim();
    
    if (objective.includes('CI/CD') || objective.includes('pipeline')) {
      return await coordinator.coordinateCIPipeline(flags);
    } else if (objective.includes('release')) {
      return await coordinator.coordinateRelease(flags);
    } else {
      // General coordination
      printInfo(`🎯 Coordinating: ${objective}`);
      
      const coordinationPlan: WorkflowConfiguration = {
        id: `general-${Date.now()}`,
        type: 'general_coordination',
        objective,
        steps: ['analyze_requirements', 'create_action_plan', 'execute_plan'],
        status: 'planning',
        repository: coordinator.state.currentRepo ? 
          `${coordinator.state.currentRepo.owner}/${coordinator.state.currentRepo.repo}` : 
          'unknown'
      };

      coordinator.state.activeCoordinations.set(coordinationPlan.id, coordinationPlan);
      
      if (coordinator.state.swarmEnabled) {
        await coordinator.executeWithSwarm(coordinationPlan);
      } else {
        await coordinator.executeCoordination(coordinationPlan);
      }

      return coordinationPlan;
    }
  } catch (error) {
    printError(`❌ GitHub coordination failed: ${(error as Error).message}`);
    throw error;
  }
}

export default GitHubCoordinator;