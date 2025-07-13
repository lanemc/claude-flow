#!/usr/bin/env node

/**
 * Performance monitoring script for Docker environment
 * Monitors resource usage, response times, and system metrics
 */

import * as os from 'os';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface PerformanceMetrics {
    timestamp: string;
    system: any;
    docker: any;
    application: any;
    network: any;
    collection_duration?: number;
}

interface SystemMetrics {
    uptime: number;
    loadavg: number[];
    memory: {
        total: number;
        free: number;
        used: number;
        usage_percent: string;
    };
    cpu: {
        count: number;
        model: string;
    };
}

interface DockerContainer {
    container: string;
    cpu_percent: string;
    memory_usage: string;
    network_io: string;
}

interface DockerImage {
    name: string;
    size: string;
}

interface EndpointCheck {
    endpoint: string;
    status: string;
    response_time?: number;
    error?: string;
}

interface ContainerStatus {
    container: string;
    status: string;
}

interface NetworkInterface {
    name: string;
    addresses: Array<{
        address: string;
        family: string;
        internal: boolean;
    }>;
}

interface DockerNetwork {
    name: string;
    driver: string;
}

// Configuration
const MONITOR_INTERVAL = process.env.MONITOR_INTERVAL || 30; // seconds
const METRICS_OUTPUT = process.env.METRICS_OUTPUT || '/shared/metrics.json';
const LOG_FILE = '/shared/performance-monitor.log';

// Metrics collection
class PerformanceMonitor {
    private metrics: PerformanceMetrics;
    private startTime: number;

    constructor() {
        this.metrics = {
            timestamp: new Date().toISOString(),
            system: {},
            docker: {},
            application: {},
            network: {}
        };
        
        this.startTime = Date.now();
        this.log('🚀 Performance monitor started');
    }
    
    log(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        
        console.log(logMessage.trim());
        
        try {
            fs.appendFileSync(LOG_FILE, logMessage);
        } catch (error: any) {
            console.error('Failed to write to log file:', error);
        }
    }
    
    // System metrics
    collectSystemMetrics(): void {
        try {
            this.metrics.system = {
                uptime: os.uptime(),
                loadavg: os.loadavg(),
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem(),
                    usage_percent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
                },
                cpu: {
                    count: os.cpus().length,
                    model: os.cpus()[0]?.model || 'unknown'
                }
            };
        } catch (error: any) {
            this.log(`❌ Error collecting system metrics: ${error.message}`);
        }
    }
    
    // Docker metrics
    collectDockerMetrics(): void {
        try {
            // Get container stats
            const dockerStats = execSync('docker stats --no-stream --format "table {{.Container}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.NetIO}}"', { encoding: 'utf8' });
            
            this.metrics.docker = {
                containers: this.parseDockerStats(dockerStats),
                images: this.getDockerImages(),
                volumes: this.getDockerVolumes()
            };
        } catch (error: any) {
            this.log(`❌ Error collecting Docker metrics: ${error.message}`);
        }
    }
    
    parseDockerStats(stats: string): DockerContainer[] {
        const lines = stats.split('\n').slice(1); // Skip header
        return lines.filter(line => line.trim()).map(line => {
            const parts = line.split('\t');
            return {
                container: parts[0],
                cpu_percent: parts[1],
                memory_usage: parts[2],
                network_io: parts[3]
            };
        });
    }
    
    getDockerImages(): DockerImage[] {
        try {
            const images = execSync('docker images --format "{{.Repository}}:{{.Tag}}\\t{{.Size}}"', { encoding: 'utf8' });
            return images.split('\n').filter(line => line.trim()).map(line => {
                const [name, size] = line.split('\t');
                return { name, size };
            });
        } catch (error: any) {
            this.log(`❌ Error getting Docker images: ${error.message}`);
            return [];
        }
    }
    
    getDockerVolumes(): string[] {
        try {
            const volumes = execSync('docker volume ls --format "{{.Name}}"', { encoding: 'utf8' });
            return volumes.split('\n').filter(line => line.trim());
        } catch (error: any) {
            this.log(`❌ Error getting Docker volumes: ${error.message}`);
            return [];
        }
    }
    
    // Application metrics
    collectApplicationMetrics(): void {
        try {
            this.metrics.application = {
                endpoints: this.checkApplicationEndpoints(),
                response_times: this.measureResponseTimes(),
                health_status: this.checkHealthStatus()
            };
        } catch (error: any) {
            this.log(`❌ Error collecting application metrics: ${error.message}`);
        }
    }
    
    checkApplicationEndpoints(): EndpointCheck[] {
        const endpoints = [
            'http://claude-flow-dev:3000/health',
            'http://claude-flow-prod:3000/health'
        ];
        
        return endpoints.map(endpoint => {
            try {
                const start = Date.now();
                execSync(`curl -f ${endpoint}`, { timeout: 5000 });
                const end = Date.now();
                
                return {
                    endpoint,
                    status: 'healthy',
                    response_time: end - start
                };
            } catch (error: any) {
                return {
                    endpoint,
                    status: 'unhealthy',
                    error: error.message
                };
            }
        });
    }
    
    measureResponseTimes(): EndpointCheck[] {
        const urls = [
            'http://claude-flow-dev:3000/api/status',
            'http://claude-flow-dev:3000/api/agents',
            'http://claude-flow-dev:3000/api/memory'
        ];
        
        return urls.map(url => {
            try {
                const start = Date.now();
                execSync(`curl -f ${url}`, { timeout: 10000 });
                const end = Date.now();
                
                return {
                    url,
                    response_time: end - start,
                    status: 'success'
                };
            } catch (error: any) {
                return {
                    url,
                    response_time: -1,
                    status: 'error',
                    error: error.message
                };
            }
        });
    }
    
    checkHealthStatus(): ContainerStatus[] {
        try {
            const containers = execSync('docker ps --format "{{.Names}}\\t{{.Status}}"', { encoding: 'utf8' });
            return containers.split('\n').filter(line => line.trim()).map(line => {
                const [name, status] = line.split('\t');
                return { container: name, status };
            });
        } catch (error: any) {
            this.log(`❌ Error checking health status: ${error.message}`);
            return [];
        }
    }
    
    // Network metrics
    collectNetworkMetrics(): void {
        try {
            this.metrics.network = {
                interfaces: this.getNetworkInterfaces(),
                docker_networks: this.getDockerNetworks()
            };
        } catch (error: any) {
            this.log(`❌ Error collecting network metrics: ${error.message}`);
        }
    }
    
    getNetworkInterfaces(): NetworkInterface[] {
        const interfaces = os.networkInterfaces();
        return Object.keys(interfaces).map(name => ({
            name,
            addresses: interfaces[name].map(addr => ({
                address: addr.address,
                family: addr.family,
                internal: addr.internal
            }))
        }));
    }
    
    getDockerNetworks(): DockerNetwork[] {
        try {
            const networks = execSync('docker network ls --format "{{.Name}}\\t{{.Driver}}"', { encoding: 'utf8' });
            return networks.split('\n').filter(line => line.trim()).map(line => {
                const [name, driver] = line.split('\t');
                return { name, driver };
            });
        } catch (error: any) {
            this.log(`❌ Error getting Docker networks: ${error.message}`);
            return [];
        }
    }
    
    // Collect all metrics
    collectAllMetrics(): void {
        this.log('📊 Collecting performance metrics...');
        
        this.collectSystemMetrics();
        this.collectDockerMetrics();
        this.collectApplicationMetrics();
        this.collectNetworkMetrics();
        
        this.metrics.collection_duration = Date.now() - this.startTime;
        this.metrics.timestamp = new Date().toISOString();
        
        this.log('✅ Metrics collection completed');
    }
    
    // Save metrics
    saveMetrics(): void {
        try {
            const metricsJson = JSON.stringify(this.metrics, null, 2);
            fs.writeFileSync(METRICS_OUTPUT, metricsJson);
            this.log(`📝 Metrics saved to ${METRICS_OUTPUT}`);
        } catch (error: any) {
            this.log(`❌ Error saving metrics: ${error.message}`);
        }
    }
    
    // Generate performance report
    generateReport(): void {
        const report = {
            summary: {
                timestamp: this.metrics.timestamp,
                system_health: this.assessSystemHealth(),
                docker_health: this.assessDockerHealth(),
                application_health: this.assessApplicationHealth(),
                recommendations: this.generateRecommendations()
            },
            detailed_metrics: this.metrics
        };
        
        try {
            const reportPath = '/shared/performance-report.json';
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            this.log(`📋 Performance report generated: ${reportPath}`);
        } catch (error: any) {
            this.log(`❌ Error generating report: ${error.message}`);
        }
    }
    
    assessSystemHealth(): string {
        const memoryUsage = parseFloat(this.metrics.system.memory?.usage_percent || 0);
        const loadAvg = this.metrics.system.loadavg?.[0] || 0;
        
        if (memoryUsage > 90 || loadAvg > 4) return 'critical';
        if (memoryUsage > 70 || loadAvg > 2) return 'warning';
        return 'healthy';
    }
    
    assessDockerHealth(): string {
        const containers = this.metrics.docker.containers || [];
        const unhealthyContainers = containers.filter(c => 
            c.cpu_percent && parseFloat(c.cpu_percent.replace('%', '')) > 90
        );
        
        if (unhealthyContainers.length > 0) return 'warning';
        return 'healthy';
    }
    
    assessApplicationHealth(): string {
        const endpoints = this.metrics.application.endpoints || [];
        const unhealthyEndpoints = endpoints.filter(e => e.status !== 'healthy');
        
        if (unhealthyEndpoints.length > 0) return 'critical';
        return 'healthy';
    }
    
    generateRecommendations(): string[] {
        const recommendations = [];
        
        const memoryUsage = parseFloat(this.metrics.system.memory?.usage_percent || 0);
        if (memoryUsage > 80) {
            recommendations.push('Consider increasing container memory limits');
        }
        
        const loadAvg = this.metrics.system.loadavg?.[0] || 0;
        if (loadAvg > 2) {
            recommendations.push('High CPU load detected - consider scaling containers');
        }
        
        const endpoints = this.metrics.application.endpoints || [];
        const slowEndpoints = endpoints.filter(e => e.response_time > 5000);
        if (slowEndpoints.length > 0) {
            recommendations.push('Slow response times detected - optimize application performance');
        }
        
        return recommendations;
    }
    
    // Main monitoring loop
    async startMonitoring(): Promise<void> {
        this.log(`🔄 Starting monitoring loop (interval: ${MONITOR_INTERVAL}s)`);
        
        while (true) {
            try {
                this.collectAllMetrics();
                this.saveMetrics();
                this.generateReport();
                
                await new Promise(resolve => setTimeout(resolve, MONITOR_INTERVAL * 1000));
            } catch (error: any) {
                this.log(`❌ Error in monitoring loop: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
            }
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down performance monitor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down performance monitor...');
    process.exit(0);
});

// Start monitoring
const monitor = new PerformanceMonitor();
monitor.startMonitoring().catch((error: any) => {
    console.error('❌ Fatal error in performance monitor:', error);
    process.exit(1);
});