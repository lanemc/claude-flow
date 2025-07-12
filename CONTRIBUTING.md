# Contributing to Claude-Flow

Thank you for your interest in contributing to Claude-Flow! This document provides everything you need to know to get started, regardless of your experience level.

## 🚀 Quick Start

Never contributed to an open-source project before? No problem! This guide will walk you through everything step by step.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Making Your First Contribution](#making-your-first-contribution)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Getting Help](#getting-help)

## Prerequisites

Before you begin, you'll need to have the following installed on your computer:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **Claude Code** (Essential for this project)
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

### Recommended Tools

- **VS Code** with recommended extensions:
  - TypeScript and JavaScript Language Features
  - GitLens
  - Prettier
  - ESLint

## Getting Started

### 1. Fork the Repository

1. Go to [https://github.com/ruvnet/claude-flow](https://github.com/ruvnet/claude-flow)
2. Click the "Fork" button in the top-right corner
3. This creates your own copy of the project

### 2. Clone Your Fork

```bash
# Replace 'your-username' with your GitHub username
git clone https://github.com/your-username/claude-flow.git
cd claude-flow
```

### 3. Add the Original Repository as Upstream

```bash
git remote add upstream https://github.com/ruvnet/claude-flow.git
```

## Setting Up Your Development Environment

### 1. Install Dependencies

```bash
npm install
```

### 2. Checkout the Development Branch

Claude-Flow development happens on the alpha branch:

```bash
git checkout claude-flow-v2.0.0
```

### 3. Build the Project

```bash
npm run build:alpha
```

### 4. Verify Your Setup

Test that everything is working:

```bash
# Activate Claude Code
claude --dangerously-skip-permissions

# Initialize the project
npx --y claude-flow@alpha init --force
```

If these commands run without errors, you're ready to contribute!

## Making Your First Contribution

### Finding Something to Work On

1. **Check Issues**: Look for issues labeled `good first issue` or `help wanted`
2. **Documentation**: Improve README, add code comments, or fix typos
3. **Testing**: Add test cases or improve existing tests
4. **Bug Fixes**: Start with small, well-defined bugs

### Creating a New Branch

Always create a new branch for your changes:

```bash
# Make sure you're on the latest version
git checkout claude-flow-v2.0.0
git pull upstream claude-flow-v2.0.0

# Create your feature branch
git checkout -b feature/your-feature-name
# OR for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Conventions

- Features: `feature/short-description`
- Bug fixes: `fix/bug-description`
- Documentation: `docs/what-you-changed`
- Chores: `chore/what-you-did`

## Development Workflow

### Understanding the Project Structure

```
claude-flow/
├── .claude/           # Claude Code configuration
├── .hive-mind/        # Hive-mind architecture files
├── src/               # Source code
├── bin/               # Executable scripts
├── docker/            # Docker configuration
├── scripts/           # Build and utility scripts
├── tests/             # Test files
└── package.json       # Project dependencies
```

### Key Concepts

- **Hive-Mind Architecture**: AI agents working together
- **MCP Tools**: 87 advanced Master Control Program tools
- **Neural Networks**: 27+ cognitive models for enhanced AI coordination
- **SQLite Memory**: Persistent memory management system

### Making Changes

1. **Small, Focused Changes**: Make one change per branch
2. **Follow Existing Patterns**: Look at existing code for style guidance
3. **Add Comments**: Explain complex logic (but avoid obvious comments)
4. **Update Documentation**: If your change affects user-facing features

## Coding Standards

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): brief description

Longer description if needed

Examples:
feat(neural): add new cognitive model for pattern recognition
fix(memory): resolve SQLite persistence issue
docs(readme): update installation instructions
chore(deps): update dependencies to latest versions
```

### Code Style

- Use TypeScript for new code
- Follow existing indentation (2 spaces)
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs

### File Naming

- Use kebab-case for file names: `neural-network.ts`
- Use PascalCase for class names: `NeuralNetwork`
- Use camelCase for functions and variables: `processData`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Add tests for new features
- Test both success and error scenarios
- Use descriptive test names
- Follow the existing test structure

Example test structure:
```javascript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

## Submitting Changes

### Before Submitting

1. **Test Your Changes**: Ensure all tests pass
2. **Lint Your Code**: Fix any linting errors
3. **Update Documentation**: If your change affects user-facing features
4. **Commit Your Changes**: Use conventional commit messages

### Creating a Pull Request

1. **Push Your Branch**:
   ```bash
   git push origin your-branch-name
   ```

2. **Open a Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Choose the `claude-flow-v2.0.0` branch as the base
   - Fill out the PR template

### Pull Request Template

Your PR should include:

```markdown
## Summary
Brief description of what this PR does

## Changes Made
- List of specific changes
- Use bullet points
- Be descriptive

## Testing
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## Related Issues
Fixes #123 (if applicable)
```

### What Happens Next

1. **Automated Checks**: GitHub will run automated tests
2. **Code Review**: Maintainers will review your code
3. **Feedback**: You may be asked to make changes
4. **Merge**: Once approved, your PR will be merged!

## Getting Help

### Where to Ask Questions

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and community support
- **Email**: Contact maintainers directly for private matters

### Common Issues and Solutions

#### "Claude Code not found"
```bash
# Reinstall Claude Code
npm install -g @anthropic-ai/claude-code
```

#### "Permission denied"
```bash
# Activate Claude Code with proper permissions
claude --dangerously-skip-permissions
```

#### "Build fails"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build:alpha
```

### Resources for New Contributors

- [GitHub's Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Recognition

All contributors will be recognized in our README. Thank you for helping make Claude-Flow better!

## License

By contributing to Claude-Flow, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Don't hesitate to ask! We're here to help you succeed. 🎉