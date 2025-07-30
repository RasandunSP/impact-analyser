"use client";

import { configManager, AppConfig } from "@/config/ai-config";
import type { AIModelConfig } from "@/config/ai-config";

// Client-side configuration manager wrapper
export class ClientConfigManager {
  private static instance: ClientConfigManager;
  private initialized = false;

  private constructor() {}

  static getInstance(): ClientConfigManager {
    if (!ClientConfigManager.instance) {
      ClientConfigManager.instance = new ClientConfigManager();
    }
    return ClientConfigManager.instance;
  }

  // Initialize the configuration manager (call this after component mount)
  initialize(): void {
    if (!this.initialized && typeof window !== 'undefined') {
      this.initialized = true;
    }
  }

  getConfig(): AppConfig {
    this.initialize();
    return configManager.getConfig();
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.initialize();
    configManager.updateConfig(updates);
  }

  getAIModel(modelId: string): AIModelConfig | undefined {
    this.initialize();
    return configManager.getAIModel(modelId);
  }

  getDefaultAIModel(): AIModelConfig | undefined {
    this.initialize();
    return configManager.getDefaultAIModel();
  }

  getEnabledAIModels(): AIModelConfig[] {
    this.initialize();
    return configManager.getEnabledAIModels();
  }

  updateAIModel(modelId: string, updates: Partial<AIModelConfig>): void {
    this.initialize();
    configManager.updateAIModel(modelId, updates);
  }

  getSystemConfig() {
    this.initialize();
    return configManager.getSystemConfig();
  }

  getUIConfig() {
    this.initialize();
    return configManager.getUIConfig();
  }

  getAnalysisConfig() {
    this.initialize();
    return configManager.getAnalysisConfig();
  }
}

// Export singleton instance
export const clientConfigManager = ClientConfigManager.getInstance(); 