"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp, 
  Shield, 
  Zap,
  Database,
  Server,
  Network,
  Lock,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";
import { 
  ImpactAnalysisResult, 
  ImpactedComponent, 
  Recommendation 
} from "@/lib/ai-analysis";

interface ImpactAnalysisProps {
  result: ImpactAnalysisResult | null;
  isLoading: boolean;
  onRetry: () => void;
}

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-500 text-white';
    case 'HIGH': return 'bg-orange-500 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    case 'LOW': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getRiskLevelIcon = (level: string) => {
  switch (level) {
    case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />;
    case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
    case 'MEDIUM': return <Clock className="w-4 h-4" />;
    case 'LOW': return <CheckCircle className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'server': return <Server className="w-4 h-4" />;
    case 'database': return <Database className="w-4 h-4" />;
    case 'service': return <Network className="w-4 h-4" />;
    case 'security': return <Lock className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'technical': return <Zap className="w-4 h-4" />;
    case 'operational': return <Activity className="w-4 h-4" />;
    case 'security': return <Shield className="w-4 h-4" />;
    case 'performance': return <TrendingUp className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

export default function ImpactAnalysis({ result, isLoading, onRetry }: ImpactAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <RefreshCw className="w-5 h-5 animate-spin text-gray-600" />
            AI Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Analyzing system impact...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="w-5 h-5 text-gray-600" />
            AI Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-4">No analysis available</p>
            <Button 
              onClick={onRetry}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="w-5 h-5 text-gray-600" />
              Impact Analysis Summary
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge className={`${getRiskLevelColor(result.riskLevel)} flex items-center gap-1`}>
                {getRiskLevelIcon(result.riskLevel)}
                {result.riskLevel} Risk
              </Badge>
              <Button 
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 leading-relaxed mb-4">{result.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Estimated Effort</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{result.estimatedEffort}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Timeline</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{result.timeline}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Impacted Components</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{result.impactedComponents.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impacted Components */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            Impacted Components
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {result.impactedComponents.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getComponentIcon(component.type)}
                    <h4 className="font-semibold text-gray-900">{component.name}</h4>
                  </div>
                  <Badge className={getRiskLevelColor(component.impactLevel)}>
                    {component.impactLevel}
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-3">{component.description}</p>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Mitigation Steps:</h5>
                  <ul className="space-y-1">
                    {component.mitigationSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield className="w-5 h-5 text-gray-600" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(recommendation.category)}
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                  </div>
                  <Badge className={getRiskLevelColor(recommendation.priority)}>
                    {recommendation.priority}
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-3">{recommendation.description}</p>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Implementation Steps:</h5>
                  <ol className="space-y-1">
                    {recommendation.implementationSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 font-medium text-xs mt-1">{stepIndex + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      {result.dependencies.length > 0 && (
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Network className="w-5 h-5 text-gray-600" />
              System Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {result.dependencies.map((dependency, index) => (
                <Badge key={index} variant="outline" className="border-gray-300 text-gray-700">
                  {dependency}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
} 