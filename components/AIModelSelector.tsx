"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Settings } from "lucide-react";
import { clientConfigManager } from "@/lib/client-config";

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function AIModelSelector({ selectedModel, onModelChange }: AIModelSelectorProps) {
  const [models, setModels] = React.useState<any[]>([]);

  React.useEffect(() => {
    const enabledModels = clientConfigManager.getEnabledAIModels();
    setModels(enabledModels);
  }, []);

  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
    // Update the default model in configuration
    clientConfigManager.updateConfig({
      ai: {
        ...clientConfigManager.getConfig().ai,
        defaultModel: modelId
      }
    });
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5" />
          AI Model Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select AI Model
            </label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose AI model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      {model.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Current Model:</strong> {models.find(m => m.id === selectedModel)?.name || 'Unknown'}</p>
            <p><strong>Provider:</strong> {models.find(m => m.id === selectedModel)?.provider || 'Unknown'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 