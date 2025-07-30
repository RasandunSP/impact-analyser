"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArchitectureDropdown from "@/components/ArchitectureDropdown";
import React from "react";
import ServerDetailsForm, { Server } from "@/components/ServerDetailsForm";
import DiagramUpload, { Diagram } from "@/components/DiagramUpload";
import ChangeRequestUpload, { ChangeRequest } from "@/components/ChangeRequestUpload";
import ImpactAnalysis from "@/components/ImpactAnalysis";
import AIModelSelector from "@/components/AIModelSelector";
import { 
  Rocket, 
  Building2, 
  Server as ServerIcon, 
  BarChart3, 
  FileText, 
  Save,
  CheckCircle,
  Cloud,
  Database,
  HardDrive,
  Monitor,
  Package,
  Zap,
  Settings,
  File,
  Code,
  ClipboardList,
  Brain,
  Sparkles
} from "lucide-react";
import { AIAnalysisService, ImpactAnalysisRequest, ImpactAnalysisResult } from "@/lib/ai-analysis";
import { clientConfigManager } from "@/lib/client-config";

export default function Home() {
  const [architecture, setArchitecture] = React.useState<string | undefined>(undefined);
  const [servers, setServers] = React.useState<Server[]>([
    { deployment: "", ram: "", os: "", disk: "", type: "" }
  ]);
  const [diagrams, setDiagrams] = React.useState<Diagram[]>([]);
  const [changeRequest, setChangeRequest] = React.useState<ChangeRequest>(null);
  const [saved, setSaved] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<ImpactAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showAnalysis, setShowAnalysis] = React.useState(false);
  const [selectedAIModel, setSelectedAIModel] = React.useState('mock-ai');

  // Initialize configuration on client side
  React.useEffect(() => {
    clientConfigManager.initialize();
    // Set the default AI model
    const defaultModel = clientConfigManager.getDefaultAIModel();
    if (defaultModel) {
      setSelectedAIModel(defaultModel.id);
    }
  }, []);

  const handleSave = () => {
    // Only store file names/types for files, not the actual file data
    const diagramsForStorage = diagrams.map(d =>
      d.type === "pdf"
        ? { type: "pdf", fileName: d.file.name }
        : { type: "mermaid", code: d.code }
    );
    let changeRequestForStorage: any = null;
    if (changeRequest) {
      if (changeRequest.type === "file") {
        changeRequestForStorage = { type: "file", fileName: changeRequest.file.name };
      } else if (changeRequest.type === "text") {
        changeRequestForStorage = { type: "text", text: changeRequest.text };
      }
    }
    const data = {
      architecture,
      servers,
      diagrams: diagramsForStorage,
      changeRequest: changeRequestForStorage,
    };
    localStorage.setItem("impact-analyzer-data", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAnalyze = async () => {
    if (!architecture || !changeRequest) {
      alert("Please complete the architecture selection and change request before analysis.");
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    try {
      const aiService = AIAnalysisService.getInstance();
      
      // Prepare analysis request
      const request: ImpactAnalysisRequest = {
        architecture,
        servers: servers.map(server => ({
          deployment: server.deployment,
          ram: server.ram,
          os: server.os,
          disk: server.disk,
          type: server.type,
          customRam: server.customRam,
          customDisk: server.customDisk
        })),
        diagrams: diagrams.map(diagram => ({
          type: diagram.type,
          name: diagram.type === "pdf" ? diagram.file.name : "Mermaid Diagram",
          content: diagram.type === "mermaid" ? diagram.code : undefined
        })),
        changeRequest: {
          type: changeRequest.type,
          content: changeRequest.type === "file" ? changeRequest.file.name : changeRequest.text
        }
      };

      console.log("Starting AI analysis with request:", request);
      const result = await aiService.analyzeImpact(request);
      console.log("AI analysis completed:", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed with detailed error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Analysis failed. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = "AI API key not configured. Please check your configuration.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Analysis timed out. Please try again.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else {
          errorMessage = `Analysis failed: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryAnalysis = () => {
    setAnalysisResult(null);
    handleAnalyze();
  };

  // Test function to verify AI configuration
  const handleTestAI = () => {
    console.log("Testing AI configuration...");
    const config = clientConfigManager.getConfig();
    const defaultModel = clientConfigManager.getDefaultAIModel();
    const enabledModels = clientConfigManager.getEnabledAIModels();
    
    console.log("Full config:", config);
    console.log("Default model:", defaultModel);
    console.log("Enabled models:", enabledModels);
    
    alert(`AI Configuration Test:\nDefault Model: ${defaultModel?.name}\nEnabled Models: ${enabledModels.map(m => m.name).join(', ')}`);
  };

  // Test Gemini API directly
  const handleTestGeminiAPI = async () => {
    try {
      console.log("Testing Gemini API directly...");
      const apiKey = 'AIzaSyCnzUdhk42ef61PC9tL2o_kKGDyb8DVfn8';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      console.log("Making test request to:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hello, this is a test message. Please respond with 'Test successful'."
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.3
          }
        })
      });

      console.log("Test response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Test API error:", errorText);
        alert(`Gemini API Test Failed:\nStatus: ${response.status}\nError: ${errorText}`);
      } else {
        const data = await response.json();
        console.log("Test API success:", data);
        alert(`Gemini API Test Successful!\nResponse: ${data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text in response'}`);
      }
    } catch (error) {
      console.error("Test API error:", error);
      alert(`Gemini API Test Error: ${error}`);
    }
  };

  // Helper function to get architecture display name
  const getArchitectureDisplayName = (value: string | undefined) => {
    if (!value) return "Not selected";
    const archMap: { [key: string]: string } = {
      "client-server": "Client-Server",
      "monolithic": "Monolithic",
      "microservices": "Microservices"
    };
    return archMap[value] || value;
  };

  // Helper function to get deployment display name
  const getDeploymentDisplayName = (value: string) => {
    const deploymentMap: { [key: string]: { label: string; icon: any; color: string } } = {
      "aws": { label: "AWS", icon: Cloud, color: "text-gray-600" },
      "azure": { label: "Azure", icon: Cloud, color: "text-gray-600" },
      "alibaba": { label: "Alibaba Cloud", icon: Cloud, color: "text-gray-600" },
      "gcp": { label: "Google Cloud", icon: Cloud, color: "text-gray-600" },
      "on-premise": { label: "On-Premise", icon: Building2, color: "text-gray-600" },
      "other": { label: "Other", icon: Settings, color: "text-gray-500" }
    };
    return deploymentMap[value] || { label: value, icon: Settings, color: "text-gray-500" };
  };

  // Helper function to get OS display name
  const getOSDisplayName = (value: string) => {
    const osMap: { [key: string]: { label: string; icon: any; color: string } } = {
      "ubuntu-22.04": { label: "Ubuntu 22.04 LTS", icon: Monitor, color: "text-gray-600" },
      "ubuntu-20.04": { label: "Ubuntu 20.04 LTS", icon: Monitor, color: "text-gray-600" },
      "centos-8": { label: "CentOS 8", icon: Monitor, color: "text-gray-600" },
      "rhel-9": { label: "Red Hat Enterprise Linux 9", icon: Monitor, color: "text-gray-600" },
      "windows-server-2022": { label: "Windows Server 2022", icon: Monitor, color: "text-gray-600" },
      "windows-server-2019": { label: "Windows Server 2019", icon: Monitor, color: "text-gray-600" },
      "macos-13": { label: "macOS 13 Ventura", icon: Monitor, color: "text-gray-800" },
      "macos-12": { label: "macOS 12 Monterey", icon: Monitor, color: "text-gray-800" },
      "debian-11": { label: "Debian 11", icon: Monitor, color: "text-gray-600" },
      "other": { label: "Other", icon: Monitor, color: "text-gray-500" }
    };
    return osMap[value] || { label: value, icon: Monitor, color: "text-gray-500" };
  };

  // Helper function to get RAM display name
  const getRAMDisplayName = (value: string, customRam?: string) => {
    if (value === "custom" && customRam) return customRam;
    const ramMap: { [key: string]: string } = {
      "1gb": "1 GB", "2gb": "2 GB", "4gb": "4 GB", "8gb": "8 GB", "16gb": "16 GB",
      "32gb": "32 GB", "64gb": "64 GB", "128gb": "128 GB", "256gb": "256 GB"
    };
    return ramMap[value] || value;
  };

  // Helper function to get disk display name
  const getDiskDisplayName = (value: string, customDisk?: string) => {
    if (value === "custom" && customDisk) return customDisk;
    const diskMap: { [key: string]: string } = {
      "20gb-ssd": "20 GB SSD", "40gb-ssd": "40 GB SSD", "80gb-ssd": "80 GB SSD",
      "160gb-ssd": "160 GB SSD", "320gb-ssd": "320 GB SSD", "640gb-ssd": "640 GB SSD",
      "1tb-ssd": "1 TB SSD", "2tb-ssd": "2 TB SSD", "4tb-ssd": "4 TB SSD",
      "1tb-hdd": "1 TB HDD", "2tb-hdd": "2 TB HDD", "4tb-hdd": "4 TB HDD", "8tb-hdd": "8 TB HDD"
    };
    return diskMap[value] || value;
  };

  // Helper function to get server type display name
  const getServerTypeDisplayName = (value: string) => {
    const typeMap: { [key: string]: { label: string; icon: any; color: string } } = {
        "physical": { label: "Physical Server", icon: ServerIcon, color: "text-gray-700" },
  "virtual": { label: "Virtual Machine", icon: ServerIcon, color: "text-gray-600" },
      "container": { label: "Container", icon: Package, color: "text-gray-600" },
      "serverless": { label: "Serverless", icon: Zap, color: "text-gray-600" },
      "other": { label: "Other", icon: Settings, color: "text-gray-500" }
    };
    return typeMap[value] || { label: value, icon: Settings, color: "text-gray-500" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Rocket className="w-10 h-10 text-gray-700" />
            Impact Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered system impact analysis for enterprise change management
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  System Architecture
                </CardTitle>
        </CardHeader>
              <CardContent className="p-6 pt-4">
          <ArchitectureDropdown value={architecture} onChange={setArchitecture} />
        </CardContent>
      </Card>
            
            <Card className="border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                          <ServerIcon className="w-5 h-5" />
        Server Details
                </CardTitle>
        </CardHeader>
              <CardContent className="p-6 pt-4">
          <ServerDetailsForm servers={servers} onChange={setServers} />
        </CardContent>
      </Card>
            
            <Card className="border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5" />
                  Upload Diagrams
                </CardTitle>
        </CardHeader>
              <CardContent className="p-6 pt-4">
          <DiagramUpload diagrams={diagrams} onChange={setDiagrams} />
        </CardContent>
      </Card>
            
            <Card className="border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" />
                  Upload Change Request
                </CardTitle>
        </CardHeader>
              <CardContent className="p-6 pt-4">
          <ChangeRequestUpload value={changeRequest} onChange={setChangeRequest} />
        </CardContent>
      </Card>
            
            <AIModelSelector 
              selectedModel={selectedAIModel} 
              onModelChange={setSelectedAIModel} 
            />
            
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Data
                </Button>
                
                <Button 
                  onClick={handleTestAI}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Test AI Config
                </Button>
                
                <Button 
                  onClick={handleTestGeminiAPI}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Test Gemini API
                </Button>
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!architecture || !changeRequest || isAnalyzing}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {isAnalyzing ? "Analyzing..." : "Analyze Impact"}
              </Button>
            </div>
            
            {saved && (
              <div className="text-gray-600 text-center bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Data saved to local storage!
              </div>
            )}
          </div>

          {/* Right Column - Summary/Visualization */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border border-gray-200 bg-white shadow-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="w-5 h-5" />
                  Summary & Attachments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-6">
                {/* Architecture Summary */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Architecture
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <span className="text-sm font-medium text-gray-800">
                      {getArchitectureDisplayName(architecture)}
                    </span>
                  </div>
                </div>

                {/* Server Details Summary */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                            <ServerIcon className="w-4 h-4" />
        Server Details ({servers.length})
                  </h3>
                  <div className="space-y-3">
                    {servers.map((server, idx) => {
                      const deployment = getDeploymentDisplayName(server.deployment);
                      const os = getOSDisplayName(server.os);
                      const ram = getRAMDisplayName(server.ram, server.customRam);
                      const disk = getDiskDisplayName(server.disk, server.customDisk);
                      const type = getServerTypeDisplayName(server.type);
                      const DeploymentIcon = deployment.icon;
                      const OSIcon = os.icon;
                      const TypeIcon = type.icon;
                      
                      return (
                        <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                          <div className="text-sm space-y-2">
                            <div className="flex items-center gap-2">
                                      <ServerIcon className="w-4 h-4 text-gray-600" />
        <span className="font-semibold text-gray-800">Server {idx + 1}</span>
                            </div>
                            
                            {server.deployment && (
                              <div className="flex items-center gap-2">
                                <DeploymentIcon className={`w-4 h-4 ${deployment.color}`} />
                                <span><strong>Platform:</strong> {deployment.label}</span>
                              </div>
                            )}
                            
                            {server.type && (
                              <div className="flex items-center gap-2">
                                <TypeIcon className={`w-4 h-4 ${type.color}`} />
                                <span><strong>Type:</strong> {type.label}</span>
                              </div>
                            )}
                            
                            {ram && (
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-gray-600" />
                                <span><strong>RAM:</strong> {ram}</span>
                              </div>
                            )}
                            
                            {disk && (
                              <div className="flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-gray-600" />
                                <span><strong>Storage:</strong> {disk}</span>
                              </div>
                            )}
                            
                            {server.os && (
                              <div className="flex items-center gap-2">
                                <OSIcon className={`w-4 h-4 ${os.color}`} />
                                <span><strong>OS:</strong> {os.label}</span>
                              </div>
                            )}
                            
                            {!server.deployment && !server.type && !ram && !disk && !server.os && (
                              <div className="text-gray-500 italic">Empty server details</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diagrams Summary */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Diagrams ({diagrams.length})
                  </h3>
                  {diagrams.length === 0 ? (
                    <div className="bg-gray-50 p-3 rounded-md text-gray-600 italic text-sm border border-gray-200">
                      No diagrams uploaded
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {diagrams.map((diagram, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <div className="text-sm flex items-center gap-2">
                            {diagram.type === "pdf" ? (
                              <>
                                <File className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-800 truncate">{diagram.file.name}</span>
                                <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">PDF</span>
                              </>
                            ) : (
                              <>
                                <Code className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-800">Mermaid Diagram</span>
                                <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">Mermaid</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Change Request Summary */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Change Request
                  </h3>
                  {!changeRequest ? (
                    <div className="bg-gray-50 p-3 rounded-md text-gray-600 italic text-sm border border-gray-200">
                      No change request uploaded
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="text-sm flex items-center gap-2">
                        {changeRequest.type === "file" ? (
                          <>
                            <File className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800 truncate">{changeRequest.file.name}</span>
                            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">File</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800">Text Request</span>
                            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">Text</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Analysis Results */}
        {showAnalysis && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">AI Impact Analysis Results</h2>
            </div>
            <ImpactAnalysis 
              result={analysisResult} 
              isLoading={isAnalyzing} 
              onRetry={handleRetryAnalysis}
            />
          </div>
        )}
      </div>
    </div>
  );
}
