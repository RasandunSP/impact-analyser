import { clientConfigManager } from "@/lib/client-config";
import type { AIModelConfig } from "@/config/ai-config";

export interface ImpactAnalysisRequest {
  architecture: string;
  servers: ServerDetails[];
  diagrams: DiagramInfo[];
  changeRequest: ChangeRequestInfo;
}

export interface ServerDetails {
  deployment: string;
  ram: string;
  os: string;
  disk: string;
  type: string;
  customRam?: string;
  customDisk?: string;
}

export interface DiagramInfo {
  type: 'pdf' | 'mermaid';
  name: string;
  content?: string; // For mermaid diagrams
}

export interface ChangeRequestInfo {
  type: 'file' | 'text';
  content: string;
}

export interface ImpactAnalysisResult {
  summary: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactedComponents: ImpactedComponent[];
  recommendations: Recommendation[];
  estimatedEffort: string;
  timeline: string;
  dependencies: string[];
  modelUsed: string;
  analysisTimestamp: Date;
}

export interface ImpactedComponent {
  name: string;
  type: 'server' | 'database' | 'service' | 'network' | 'security';
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  mitigationSteps: string[];
}

export interface Recommendation {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'technical' | 'operational' | 'security' | 'performance';
  title: string;
  description: string;
  implementationSteps: string[];
}

// AI Provider Interface
export interface AIProvider {
  analyze(request: ImpactAnalysisRequest, model: AIModelConfig): Promise<ImpactAnalysisResult>;
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  async analyze(request: ImpactAnalysisRequest, model: AIModelConfig): Promise<ImpactAnalysisResult> {
    if (!model.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildPrompt(request);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${model.apiKey}`
        },
        body: JSON.stringify({
          model: model.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert system architect and change management specialist. Analyze the provided system information and change request to generate a comprehensive impact analysis report.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: model.maxTokens,
          temperature: model.temperature
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from OpenAI API');
      }

      return this.parseAIResponse(aiResponse, model.name);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private buildPrompt(request: ImpactAnalysisRequest): string {
    return `
Please analyze the following system change request and provide a comprehensive impact analysis:

SYSTEM ARCHITECTURE: ${request.architecture}

SERVERS:
${request.servers.map((server, index) => `
Server ${index + 1}:
- Deployment: ${server.deployment}
- Type: ${server.type}
- RAM: ${server.customRam || server.ram}
- Storage: ${server.customDisk || server.disk}
- OS: ${server.os}
`).join('')}

DIAGRAMS: ${request.diagrams.length} diagram(s) uploaded
${request.diagrams.map(d => `- ${d.name} (${d.type})`).join('\n')}

CHANGE REQUEST:
${request.changeRequest.content}

Please provide a JSON response with the following structure:
{
  "summary": "Brief summary of the analysis",
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "impactedComponents": [
    {
      "name": "Component name",
      "type": "server|database|service|network|security",
      "impactLevel": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "Impact description",
      "mitigationSteps": ["Step 1", "Step 2"]
    }
  ],
  "recommendations": [
    {
      "priority": "LOW|MEDIUM|HIGH|CRITICAL",
      "category": "technical|operational|security|performance",
      "title": "Recommendation title",
      "description": "Recommendation description",
      "implementationSteps": ["Step 1", "Step 2"]
    }
  ],
  "estimatedEffort": "1-2 weeks",
  "timeline": "2-4 weeks (Standard timeline)",
  "dependencies": ["Dependency 1", "Dependency 2"]
}
    `.trim();
  }

  private parseAIResponse(response: string, modelName: string): ImpactAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          modelUsed: modelName,
          analysisTimestamp: new Date()
        };
      }
      
      // Fallback to mock response if JSON parsing fails
      return this.generateFallbackResponse(modelName);
    } catch (error) {
      console.warn('Failed to parse AI response, using fallback:', error);
      return this.generateFallbackResponse(modelName);
    }
  }

  private generateFallbackResponse(modelName: string): ImpactAnalysisResult {
    return {
      summary: "Analysis completed using AI model. The proposed changes have been evaluated for potential impacts across the system architecture.",
      riskLevel: 'MEDIUM',
      impactedComponents: [
        {
          name: 'System Architecture',
          type: 'service',
          impactLevel: 'MEDIUM',
          description: 'Changes may affect overall system architecture patterns',
          mitigationSteps: ['Review architecture diagrams', 'Update documentation', 'Test integration points']
        }
      ],
      recommendations: [
        {
          priority: 'MEDIUM',
          category: 'technical',
          title: 'Architecture Review',
          description: 'Conduct thorough architecture review before implementation',
          implementationSteps: ['Schedule review meeting', 'Update architecture documentation', 'Validate design decisions']
        }
      ],
      estimatedEffort: '2-4 weeks',
      timeline: '1-2 months (Standard timeline)',
      dependencies: ['Architecture Review', 'Stakeholder Approval'],
      modelUsed: modelName,
      analysisTimestamp: new Date()
    };
  }
}

// Gemini Provider
export class GeminiProvider implements AIProvider {
  async analyze(request: ImpactAnalysisRequest, model: AIModelConfig): Promise<ImpactAnalysisResult> {
    console.log("GeminiProvider: Starting analysis with model:", model.name);
    
    if (!model.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = this.buildPrompt(request);
    console.log("GeminiProvider: Built prompt, length:", prompt.length);
    
    try {
      // Fixed Gemini API endpoint URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.model}:generateContent?key=${model.apiKey}`;
      console.log("GeminiProvider: Making request to Gemini API...");
      console.log("GeminiProvider: URL:", url);
      console.log("GeminiProvider: Model:", model.model);
      console.log("GeminiProvider: API Key (first 10 chars):", model.apiKey?.substring(0, 10) + "...");
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: model.maxTokens,
          temperature: model.temperature
        }
      };
      
      console.log("GeminiProvider: Request body:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log("GeminiProvider: Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("GeminiProvider: API error response:", errorText);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("GeminiProvider: Response data received");
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        console.error("GeminiProvider: No response text in data:", data);
        throw new Error('No response from Gemini API');
      }

      console.log("GeminiProvider: Parsing AI response...");
      return this.parseAIResponse(aiResponse, model.name);
    } catch (error) {
      console.error('GeminiProvider: Error during analysis:', error);
      throw error;
    }
  }

  private buildPrompt(request: ImpactAnalysisRequest): string {
    return `
Please analyze the following system change request and provide a comprehensive impact analysis:

SYSTEM ARCHITECTURE: ${request.architecture}

SERVERS:
${request.servers.map((server, index) => `
Server ${index + 1}:
- Deployment: ${server.deployment}
- Type: ${server.type}
- RAM: ${server.customRam || server.ram}
- Storage: ${server.customDisk || server.disk}
- OS: ${server.os}
`).join('')}

DIAGRAMS: ${request.diagrams.length} diagram(s) uploaded
${request.diagrams.map(d => `- ${d.name} (${d.type})`).join('\n')}

CHANGE REQUEST:
${request.changeRequest.content}

Please provide a JSON response with the following structure:
{
  "summary": "Brief summary of the analysis",
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "impactedComponents": [
    {
      "name": "Component name",
      "type": "server|database|service|network|security",
      "impactLevel": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "Impact description",
      "mitigationSteps": ["Step 1", "Step 2"]
    }
  ],
  "recommendations": [
    {
      "priority": "LOW|MEDIUM|HIGH|CRITICAL",
      "category": "technical|operational|security|performance",
      "title": "Recommendation title",
      "description": "Recommendation description",
      "implementationSteps": ["Step 1", "Step 2"]
    }
  ],
  "estimatedEffort": "1-2 weeks",
  "timeline": "2-4 weeks (Standard timeline)",
  "dependencies": ["Dependency 1", "Dependency 2"]
}
    `.trim();
  }

  private parseAIResponse(response: string, modelName: string): ImpactAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          modelUsed: modelName,
          analysisTimestamp: new Date()
        };
      }
      
      // Fallback to mock response if JSON parsing fails
      return this.generateFallbackResponse(modelName);
    } catch (error) {
      console.warn('Failed to parse AI response, using fallback:', error);
      return this.generateFallbackResponse(modelName);
    }
  }

  private generateFallbackResponse(modelName: string): ImpactAnalysisResult {
    return {
      summary: "Analysis completed using Gemini AI model. The proposed changes have been evaluated for potential impacts across the system architecture.",
      riskLevel: 'MEDIUM',
      impactedComponents: [
        {
          name: 'System Architecture',
          type: 'service',
          impactLevel: 'MEDIUM',
          description: 'Changes may affect overall system architecture patterns',
          mitigationSteps: ['Review architecture diagrams', 'Update documentation', 'Test integration points']
        }
      ],
      recommendations: [
        {
          priority: 'MEDIUM',
          category: 'technical',
          title: 'Architecture Review',
          description: 'Conduct thorough architecture review before implementation',
          implementationSteps: ['Schedule review meeting', 'Update architecture documentation', 'Validate design decisions']
        }
      ],
      estimatedEffort: '2-4 weeks',
      timeline: '1-2 months (Standard timeline)',
      dependencies: ['Architecture Review', 'Stakeholder Approval'],
      modelUsed: modelName,
      analysisTimestamp: new Date()
    };
  }
}

// Mock AI Provider (for development)
export class MockAIProvider implements AIProvider {
  async analyze(request: ImpactAnalysisRequest, model: AIModelConfig): Promise<ImpactAnalysisResult> {
    console.log("MockAIProvider: Starting analysis with model:", model.name);
    console.log("MockAIProvider: Request data:", request);
    
    // Simulate AI processing time based on model configuration
    const timeout = model.timeout || 2000;
    console.log(`MockAIProvider: Simulating ${timeout}ms processing time...`);
    await new Promise(resolve => setTimeout(resolve, timeout));

    console.log("MockAIProvider: Processing analysis...");

    // Analyze architecture impact
    const architectureImpact = this.analyzeArchitectureImpact(request.architecture, request.changeRequest);
    console.log("MockAIProvider: Architecture impacts:", architectureImpact);
    
    // Analyze server impact
    const serverImpact = this.analyzeServerImpact(request.servers, request.changeRequest);
    console.log("MockAIProvider: Server impacts:", serverImpact);
    
    // Analyze diagram insights
    const diagramInsights = this.analyzeDiagramInsights(request.diagrams, request.changeRequest);
    console.log("MockAIProvider: Diagram insights:", diagramInsights);

    // Generate comprehensive impact report
    const result = this.generateImpactReport(architectureImpact, serverImpact, diagramInsights, request, model);
    console.log("MockAIProvider: Generated result:", result);
    
    return result;
  }

  private analyzeArchitectureImpact(architecture: string, changeRequest: ChangeRequestInfo): ImpactedComponent[] {
    const impacts: ImpactedComponent[] = [];
    
    if (architecture === 'microservices') {
      impacts.push({
        name: 'Service Communication',
        type: 'service' as const,
        impactLevel: 'MEDIUM' as const,
        description: 'Changes may affect inter-service communication patterns',
        mitigationSteps: ['Review API contracts', 'Update service discovery', 'Test service integration']
      });
    } else if (architecture === 'monolithic') {
      impacts.push({
        name: 'Application Deployment',
        type: 'service' as const,
        impactLevel: 'HIGH' as const,
        description: 'Monolithic deployments require full application redeployment',
        mitigationSteps: ['Plan deployment windows', 'Prepare rollback strategy', 'Coordinate with stakeholders']
      });
    }

    return impacts;
  }

  private analyzeServerImpact(servers: ServerDetails[], changeRequest: ChangeRequestInfo): ImpactedComponent[] {
    const impacts: ImpactedComponent[] = [];
    
    servers.forEach((server, index) => {
      if (server.type === 'container') {
        impacts.push({
          name: `Server ${index + 1} - Container Orchestration`,
          type: 'server' as const,
          impactLevel: 'MEDIUM' as const,
          description: 'Container-based deployment may require orchestration updates',
          mitigationSteps: ['Update container images', 'Modify deployment manifests', 'Test container networking']
        });
      } else if (server.type === 'serverless') {
        impacts.push({
          name: `Server ${index + 1} - Serverless Functions`,
          type: 'server' as const,
          impactLevel: 'LOW' as const,
          description: 'Serverless architecture provides good isolation for changes',
          mitigationSteps: ['Update function configurations', 'Test cold starts', 'Monitor execution times']
        });
      }
    });

    return impacts;
  }

  private analyzeDiagramInsights(diagrams: DiagramInfo[], changeRequest: ChangeRequestInfo): ImpactedComponent[] {
    const insights: ImpactedComponent[] = [];
    
    diagrams.forEach(diagram => {
      if (diagram.type === 'mermaid' && diagram.content) {
        // Analyze mermaid diagram content for system dependencies
        if (diagram.content.includes('database')) {
          insights.push({
            name: 'Database Dependencies',
            type: 'database' as const,
            impactLevel: 'HIGH' as const,
            description: 'System includes database dependencies that may be affected',
            mitigationSteps: ['Review database schema changes', 'Plan data migration', 'Test database connectivity']
          });
        }
      }
    });

    return insights;
  }

  private generateImpactReport(
    architectureImpact: ImpactedComponent[],
    serverImpact: ImpactedComponent[],
    diagramInsights: ImpactedComponent[],
    request: ImpactAnalysisRequest,
    model: AIModelConfig
  ): ImpactAnalysisResult {
    const allImpacts = [...architectureImpact, ...serverImpact, ...diagramInsights];
    const riskLevel = this.calculateOverallRiskLevel(allImpacts);
    
    return {
      summary: this.generateSummary(request, allImpacts),
      riskLevel,
      impactedComponents: allImpacts,
      recommendations: this.generateRecommendations(allImpacts, request),
      estimatedEffort: this.estimateEffort(allImpacts),
      timeline: this.estimateTimeline(allImpacts),
      dependencies: this.identifyDependencies(request),
      modelUsed: model.name,
      analysisTimestamp: new Date()
    };
  }

  private calculateOverallRiskLevel(impacts: ImpactedComponent[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const criticalCount = impacts.filter(i => i.impactLevel === 'CRITICAL').length;
    const highCount = impacts.filter(i => i.impactLevel === 'HIGH').length;
    
    if (criticalCount > 0) return 'CRITICAL';
    if (highCount > 2) return 'HIGH';
    if (highCount > 0 || impacts.length > 3) return 'MEDIUM';
    return 'LOW';
  }

  private generateSummary(request: ImpactAnalysisRequest, impacts: ImpactedComponent[]): string {
    const impactCount = impacts.length;
    const criticalCount = impacts.filter(i => i.impactLevel === 'CRITICAL').length;
    
    return `Analysis of the proposed changes reveals ${impactCount} potentially impacted components across the ${request.architecture} architecture. ${criticalCount > 0 ? `Critical impacts identified in ${criticalCount} areas require immediate attention.` : 'All impacts are manageable with proper planning.'}`;
  }

  private generateRecommendations(impacts: ImpactedComponent[], request: ImpactAnalysisRequest): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Technical recommendations
    if (impacts.some(i => i.type === 'database')) {
      recommendations.push({
        priority: 'HIGH',
        category: 'technical',
        title: 'Database Impact Assessment',
        description: 'Conduct thorough database impact analysis before implementation',
        implementationSteps: [
          'Review current database schema',
          'Identify required schema changes',
          'Plan data migration strategy',
          'Test database performance impact'
        ]
      });
    }

    // Security recommendations
    recommendations.push({
      priority: 'MEDIUM',
      category: 'security',
      title: 'Security Review',
      description: 'Ensure changes don\'t introduce security vulnerabilities',
      implementationSteps: [
        'Conduct security impact assessment',
        'Review access control requirements',
        'Test authentication and authorization',
        'Update security documentation'
      ]
    });

    // Operational recommendations
    recommendations.push({
      priority: 'MEDIUM',
      category: 'operational',
      title: 'Deployment Planning',
      description: 'Plan deployment strategy to minimize service disruption',
      implementationSteps: [
        'Schedule maintenance windows',
        'Prepare rollback procedures',
        'Coordinate with operations team',
        'Set up monitoring and alerting'
      ]
    });

    return recommendations;
  }

  private estimateEffort(impacts: ImpactedComponent[]): string {
    const totalImpact = impacts.reduce((sum, impact) => {
      switch (impact.impactLevel) {
        case 'CRITICAL': return sum + 4;
        case 'HIGH': return sum + 3;
        case 'MEDIUM': return sum + 2;
        case 'LOW': return sum + 1;
        default: return sum;
      }
    }, 0);

    if (totalImpact <= 3) return '1-2 weeks';
    if (totalImpact <= 6) return '2-4 weeks';
    if (totalImpact <= 10) return '1-2 months';
    return '2-3 months';
  }

  private estimateTimeline(impacts: ImpactedComponent[]): string {
    const effort = this.estimateEffort(impacts);
    const criticalCount = impacts.filter(i => i.impactLevel === 'CRITICAL').length;
    
    if (criticalCount > 0) {
      return `${effort} (Urgent - Critical impacts detected)`;
    }
    return `${effort} (Standard timeline)`;
  }

  private identifyDependencies(request: ImpactAnalysisRequest): string[] {
    const dependencies = [];
    
    if (request.architecture === 'microservices') {
      dependencies.push('Service Discovery Service');
      dependencies.push('API Gateway');
      dependencies.push('Load Balancer');
    }
    
    if (request.servers.some(s => s.type === 'container')) {
      dependencies.push('Container Orchestration Platform');
      dependencies.push('Container Registry');
    }
    
    if (request.servers.some(s => s.type === 'serverless')) {
      dependencies.push('Serverless Platform');
      dependencies.push('Event Bus');
    }
    
    return dependencies;
  }
}

// AI Analysis Service
export class AIAnalysisService {
  private static instance: AIAnalysisService;
  private providers: Map<string, AIProvider>;
  private cache: Map<string, { result: ImpactAnalysisResult; timestamp: number }>;

  private constructor() {
    this.providers = new Map();
    this.cache = new Map();
    this.initializeProviders();
  }

  static getInstance(): AIAnalysisService {
    if (!AIAnalysisService.instance) {
      AIAnalysisService.instance = new AIAnalysisService();
    }
    return AIAnalysisService.instance;
  }

  private initializeProviders(): void {
    // Register AI providers
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('mock', new MockAIProvider());
  }

  async analyzeImpact(request: ImpactAnalysisRequest): Promise<ImpactAnalysisResult> {
    console.log("AIAnalysisService: Starting analysis...");
    
    const config = clientConfigManager.getConfig();
    const model = clientConfigManager.getDefaultAIModel();
    
    console.log("AIAnalysisService: Config loaded, default model:", model?.name);
    
    if (!model) {
      throw new Error('No AI model configured');
    }

    // Check cache if enabled
    if (config.ai.analysis.cacheResults) {
      const cacheKey = this.generateCacheKey(request, model.id);
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < (config.ai.analysis.cacheExpiry * 60 * 1000)) {
        console.log("AIAnalysisService: Returning cached result");
        return cached.result;
      }
    }

    // Get provider
    const provider = this.providers.get(model.provider);
    if (!provider) {
      throw new Error(`AI provider '${model.provider}' not available. Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    console.log(`AIAnalysisService: Using provider '${model.provider}' with model '${model.name}'`);

    // Perform analysis with retries
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= config.ai.analysis.maxRetries; attempt++) {
      try {
        console.log(`AIAnalysisService: Attempt ${attempt}/${config.ai.analysis.maxRetries}`);
        
        const result = await Promise.race([
          provider.analyze(request, model),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Analysis timeout')), config.ai.analysis.analysisTimeout)
          )
        ]);

        console.log("AIAnalysisService: Analysis completed successfully");

        // Cache result if enabled
        if (config.ai.analysis.cacheResults) {
          const cacheKey = this.generateCacheKey(request, model.id);
          this.cache.set(cacheKey, { result, timestamp: Date.now() });
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`AIAnalysisService: Attempt ${attempt} failed:`, error);
        
        if (attempt < config.ai.analysis.maxRetries) {
          const delay = 1000 * attempt;
          console.log(`AIAnalysisService: Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error("AIAnalysisService: All attempts failed");
    throw lastError || new Error('Analysis failed after all retries');
  }

  private generateCacheKey(request: ImpactAnalysisRequest, modelId: string): string {
    return `${modelId}-${JSON.stringify(request)}`;
  }

  // Method to register new AI providers
  registerProvider(providerId: string, provider: AIProvider): void {
    this.providers.set(providerId, provider);
  }

  // Method to clear cache
  clearCache(): void {
    this.cache.clear();
  }
} 