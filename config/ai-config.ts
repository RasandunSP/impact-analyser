// AI Model Configuration
export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'gemini' | 'custom';
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  enabled: boolean;
}

// Analysis Configuration
export interface AnalysisConfig {
  enableRealTimeAnalysis: boolean;
  analysisTimeout: number;
  maxRetries: number;
  cacheResults: boolean;
  cacheExpiry: number; // in minutes
}

// System Configuration
export interface SystemConfig {
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  maxDiagrams: number;
  maxServers: number;
  enableAutoSave: boolean;
  autoSaveInterval: number; // in seconds
}

// UI Configuration
export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  enableAnimations: boolean;
  showAdvancedOptions: boolean;
}

// Main Configuration Interface
export interface AppConfig {
  ai: {
    models: AIModelConfig[];
    defaultModel: string;
    analysis: AnalysisConfig;
  };
  system: SystemConfig;
  ui: UIConfig;
}

// Default Configuration
export const defaultConfig: AppConfig = {
  ai: {
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        model: 'gpt-4',
        apiKey: process.env.OPENAI_API_KEY,
        maxTokens: 4000,
        temperature: 0.3,
        timeout: 30000,
        enabled: true
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: process.env.OPENAI_API_KEY,
        maxTokens: 4000,
        temperature: 0.3,
        timeout: 30000,
        enabled: true
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'gemini',
        model: 'gemini-pro',
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        maxTokens: 4000,
        temperature: 0.3,
        timeout: 30000,
        enabled: true
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        provider: 'gemini',
        model: 'gemini-pro-vision',
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        maxTokens: 4000,
        temperature: 0.3,
        timeout: 30000,
        enabled: true
      },
      {
        id: 'mock-ai',
        name: 'Mock AI (Development)',
        provider: 'custom',
        model: 'mock',
        maxTokens: 4000,
        temperature: 0.3,
        timeout: 2000,
        enabled: true
      }
    ],
    defaultModel: 'mock-ai',
    analysis: {
      enableRealTimeAnalysis: false,
      analysisTimeout: 30000,
      maxRetries: 3,
      cacheResults: true,
      cacheExpiry: 60
    }
  },
  system: {
    maxFileSize: 10,
    allowedFileTypes: ['.pdf', '.txt', '.doc', '.docx'],
    maxDiagrams: 20,
    maxServers: 10,
    enableAutoSave: true,
    autoSaveInterval: 30
  },
  ui: {
    theme: 'light',
    primaryColor: '#374151',
    accentColor: '#6B7280',
    enableAnimations: true,
    showAdvancedOptions: false
  }
};

// Helper function to check if we're in the browser
const isClient = typeof window !== 'undefined';

// Configuration Manager
export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AppConfig {
    // Only try to load from localStorage if we're in the browser
    if (isClient) {
      try {
        const savedConfig = localStorage.getItem('impact-analyzer-config');
        if (savedConfig) {
          return { ...defaultConfig, ...JSON.parse(savedConfig) };
        }
      } catch (error) {
        console.warn('Failed to load saved config, using defaults:', error);
      }
    }
    return defaultConfig;
  }

  getConfig(): AppConfig {
    return this.config;
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  private saveConfig(): void {
    // Only save to localStorage if we're in the browser
    if (isClient) {
      try {
        localStorage.setItem('impact-analyzer-config', JSON.stringify(this.config));
      } catch (error) {
        console.error('Failed to save config:', error);
      }
    }
  }

  // AI Model specific methods
  getAIModel(modelId: string): AIModelConfig | undefined {
    return this.config.ai.models.find(model => model.id === modelId);
  }

  getDefaultAIModel(): AIModelConfig | undefined {
    return this.getAIModel(this.config.ai.defaultModel);
  }

  getEnabledAIModels(): AIModelConfig[] {
    return this.config.ai.models.filter(model => model.enabled);
  }

  updateAIModel(modelId: string, updates: Partial<AIModelConfig>): void {
    const modelIndex = this.config.ai.models.findIndex(model => model.id === modelId);
    if (modelIndex !== -1) {
      this.config.ai.models[modelIndex] = { ...this.config.ai.models[modelIndex], ...updates };
      this.saveConfig();
    }
  }

  // System configuration methods
  getSystemConfig(): SystemConfig {
    return this.config.system;
  }

  // UI configuration methods
  getUIConfig(): UIConfig {
    return this.config.ui;
  }

  // Analysis configuration methods
  getAnalysisConfig(): AnalysisConfig {
    return this.config.ai.analysis;
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance(); 