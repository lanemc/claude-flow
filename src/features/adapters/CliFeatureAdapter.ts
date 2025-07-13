import { ConfigManager } from '../../config/config-manager';
import chalk from 'chalk';

export interface CliFeatureAdapter {
  listFeatures(args: any[], options: any): Promise<void>;
  enableFeature(args: any[], options: any): Promise<void>;
  disableFeature(args: any[], options: any): Promise<void>;
  toggleFeature(args: any[], options: any): Promise<void>;
  configureFeature(args: any[], options: any): Promise<void>;
  showFeatureStatus(args: any[], options: any): Promise<void>;
}

export function createCliFeatureAdapter(configManager: ConfigManager): CliFeatureAdapter {
  return {
    async listFeatures(args: any[], options: any): Promise<void> {
      console.log(chalk.blue('Available features:'));
      const config = configManager.show();
      
      const features = [
        { name: 'ruv-swarm', enabled: config.ruvSwarm?.enabled || false },
        { name: 'mcp', enabled: config.mcp?.transport ? true : false },
        { name: 'neural-features', enabled: config.ruvSwarm?.enableNeuralTraining || false },
        { name: 'memory-backend', value: config.memory?.backend || 'sqlite' }
      ];
      
      features.forEach(feature => {
        const status = feature.enabled !== undefined 
          ? (feature.enabled ? chalk.green('enabled') : chalk.red('disabled'))
          : chalk.yellow(feature.value);
        console.log(`  - ${feature.name}: ${status}`);
      });
    },

    async enableFeature(args: any[], options: any): Promise<void> {
      const featureName = args[0];
      if (!featureName) {
        console.error(chalk.red('Feature name is required'));
        return;
      }
      
      switch (featureName) {
        case 'ruv-swarm':
          configManager.set('ruvSwarm.enabled', true);
          break;
        case 'neural-features':
          configManager.set('ruvSwarm.enableNeuralTraining', true);
          break;
        default:
          console.error(chalk.red(`Unknown feature: ${featureName}`));
          return;
      }
      
      await configManager.save();
      console.log(chalk.green(`Feature '${featureName}' enabled`));
    },

    async disableFeature(args: any[], options: any): Promise<void> {
      const featureName = args[0];
      if (!featureName) {
        console.error(chalk.red('Feature name is required'));
        return;
      }
      
      switch (featureName) {
        case 'ruv-swarm':
          configManager.set('ruvSwarm.enabled', false);
          break;
        case 'neural-features':
          configManager.set('ruvSwarm.enableNeuralTraining', false);
          break;
        default:
          console.error(chalk.red(`Unknown feature: ${featureName}`));
          return;
      }
      
      await configManager.save();
      console.log(chalk.green(`Feature '${featureName}' disabled`));
    },

    async toggleFeature(args: any[], options: any): Promise<void> {
      const featureName = args[0];
      if (!featureName) {
        console.error(chalk.red('Feature name is required'));
        return;
      }
      
      const config = configManager.show();
      let newStatus: boolean;
      
      switch (featureName) {
        case 'ruv-swarm':
          newStatus = !config.ruvSwarm.enabled;
          configManager.set('ruvSwarm.enabled', newStatus);
          break;
        case 'neural-features':
          newStatus = !config.ruvSwarm.enableNeuralTraining;
          configManager.set('ruvSwarm.enableNeuralTraining', newStatus);
          break;
        default:
          console.error(chalk.red(`Unknown feature: ${featureName}`));
          return;
      }
      
      await configManager.save();
      const status = newStatus;
      console.log(chalk.green(`Feature '${featureName}' ${status ? 'enabled' : 'disabled'}`));
    },

    async configureFeature(args: any[], options: any): Promise<void> {
      const [featureName, key, value] = args;
      if (!featureName || !key || !value) {
        console.error(chalk.red('Usage: configure <feature> <key> <value>'));
        return;
      }
      
      // Set nested configuration values using configManager.set
      const configPath = `${featureName}.${key}`;
      configManager.set(configPath, value);
      await configManager.save();
      console.log(chalk.green(`Set ${featureName}.${key} = ${value}`));
    },

    async showFeatureStatus(args: any[], options: any): Promise<void> {
      const featureName = args[0];
      if (!featureName) {
        console.error(chalk.red('Feature name is required'));
        return;
      }
      
      const config = configManager.show();
      
      switch (featureName) {
        case 'ruv-swarm':
          console.log(chalk.blue(`Feature '${featureName}':`));
          console.log(`  Enabled: ${config.ruvSwarm.enabled ? chalk.green('yes') : chalk.red('no')}`);
          console.log(`  Topology: ${chalk.yellow(config.ruvSwarm.defaultTopology)}`);
          console.log(`  Max Agents: ${chalk.yellow(config.ruvSwarm.maxAgents)}`);
          console.log(`  Neural Enabled: ${config.ruvSwarm.enableNeuralTraining ? chalk.green('yes') : chalk.red('no')}`);
          break;
        case 'mcp':
          console.log(chalk.blue(`Feature '${featureName}':`));
          console.log(`  Transport: ${chalk.yellow(config.mcp.transport)}`);
          console.log(`  Port: ${chalk.yellow(config.mcp.port)}`);
          console.log(`  TLS Enabled: ${config.mcp.tlsEnabled ? chalk.green('yes') : chalk.red('no')}`);
          break;
        default:
          console.error(chalk.red(`Unknown feature: ${featureName}`));
      }
    }
  };
}