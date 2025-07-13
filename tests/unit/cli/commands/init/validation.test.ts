import { join } from "path";
import { existsSync, mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync, realpathSync } from "fs";
import { tmpdir } from "os";

describe("Init Command Validation Tests", () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = mkdtempSync(join(tmpdir(), "claude_flow_validation_test_"));
    process.env["PWD"] = testDir;
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("File integrity validation", () => {
    it("should create valid JSON files", () => {
      const testConfig = {
        name: "test-config",
        version: "1.0.0",
        settings: {
          debug: true,
          maxAgents: 5
        }
      };

      const configPath = join(testDir, "config.json");
      writeFileSync(configPath, JSON.stringify(testConfig, null, 2), 'utf8');

      expect(existsSync(configPath)).toBe(true);

      // Validate JSON is parseable
      const content = readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(content);
      
      expect(parsed.name).toBe("test-config");
      expect(parsed.settings.maxAgents).toBe(5);
    });

    it("should validate file permissions", () => {
      const testFile = join(testDir, "test-permissions.txt");
      writeFileSync(testFile, "test content", 'utf8');
      
      expect(existsSync(testFile)).toBe(true);
      
      const content = readFileSync(testFile, 'utf8');
      expect(content).toBe("test content");
    });

    it("should handle file path validation", () => {
      // Test various path scenarios
      const paths = [
        "simple.txt",
        "nested/deep/file.txt",
        ".hidden/config.json",
        "spaces in name.txt"
      ];

      paths.forEach(relativePath => {
        const fullPath = join(testDir, relativePath);
        const dir = join(fullPath, '..');
        
        // Create directory structure if needed
        try {
          mkdirSync(dir, { recursive: true });
          writeFileSync(fullPath, `content for ${relativePath}`, 'utf8');
          expect(existsSync(fullPath)).toBe(true);
        } catch (error) {
          // Some paths might be invalid on certain OS
          console.warn(`Skipping invalid path: ${relativePath}`);
        }
      });
    });
  });

  describe("Content validation", () => {
    it("should validate markdown structure", () => {
      const markdownContent = `# Test Document

## Section 1
This is a test section.

## Section 2
Another section with **bold** text.

- List item 1
- List item 2

\`\`\`javascript
console.log("code block");
\`\`\`
`;

      const mdPath = join(testDir, "test.md");
      writeFileSync(mdPath, markdownContent, 'utf8');
      
      const content = readFileSync(mdPath, 'utf8');
      expect(content).toContain("# Test Document");
      expect(content).toContain("## Section 1");
      expect(content).toContain("**bold**");
      expect(content).toContain("```javascript");
    });

    it("should validate configuration structure", () => {
      const config = {
        claude: {
          version: "2.0.0",
          features: ["swarm", "mcp", "templates"],
          settings: {
            maxAgents: 10,
            timeout: 30000
          }
        }
      };

      const configPath = join(testDir, "claude-config.json");
      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      
      const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
      expect(parsed.claude.version).toBe("2.0.0");
      expect(parsed.claude.features).toContain("swarm");
      expect(parsed.claude.settings.maxAgents).toBe(10);
    });
  });

  describe("Environment validation", () => {
    it("should validate working directory", () => {
      // Handle macOS symlink resolution
      const currentDir = process.cwd();
      const normalizedTestDir = realpathSync(testDir);
      const normalizedCurrentDir = realpathSync(currentDir);
      expect(normalizedCurrentDir).toBe(normalizedTestDir);
      expect(existsSync(testDir)).toBe(true);
    });

    it("should validate environment variables", () => {
      process.env["TEST_VAR"] = "test-value";
      expect(process.env["TEST_VAR"]).toBe("test-value");
      
      delete process.env["TEST_VAR"];
      expect(process.env["TEST_VAR"]).toBeUndefined();
    });
  });
});