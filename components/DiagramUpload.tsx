"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  File, 
  BarChart3, 
  Plus, 
  Trash2, 
  Upload,
  Code,
  FileText
} from "lucide-react";

export type Diagram = { type: "pdf"; file: File } | { type: "mermaid"; code: string };

export default function DiagramUpload({ diagrams, onChange }: { diagrams: Diagram[]; onChange: (diagrams: Diagram[]) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mermaidCode, setMermaidCode] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newDiagrams: Diagram[] = [];
    for (let i = 0; i < files.length && diagrams.length + newDiagrams.length < 20; i++) {
      newDiagrams.push({ type: "pdf", file: files[i] });
    }
    onChange([...diagrams, ...newDiagrams]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddMermaid = () => {
    if (mermaidCode.trim() && diagrams.length < 20) {
      onChange([...diagrams, { type: "mermaid", code: mermaidCode.trim() }]);
      setMermaidCode("");
    }
  };

  const handleRemove = (idx: number) => {
    onChange(diagrams.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PDF Upload Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <File className="w-4 h-4 text-emerald-600" />
          Upload PDF Diagrams
        </label>
        <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 bg-emerald-50 hover:bg-emerald-100 transition-colors">
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={diagrams.length >= 20}
            className="border-0 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
          />
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <Upload className="w-3 h-3" />
            Drag and drop PDF files or click to browse
          </p>
        </div>
      </div>

      {/* Mermaid Code Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Code className="w-4 h-4 text-purple-600" />
          Add Mermaid Diagrams
        </label>
        <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 bg-purple-50">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Paste your mermaid chart code here...&#10;Example:&#10;graph TD&#10;  A[Start] --> B[Process]&#10;  B --> C[End]"
              value={mermaidCode}
              onChange={e => setMermaidCode(e.target.value)}
              className="flex-1 border-0 bg-transparent resize-none"
              rows={4}
              disabled={diagrams.length >= 20}
            />
            <Button 
              onClick={handleAddMermaid} 
              type="button" 
              disabled={!mermaidCode.trim() || diagrams.length >= 20}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Uploaded Diagrams List */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          Uploaded Diagrams ({diagrams.length}/20)
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {diagrams.map((d, idx) => (
            <div key={idx} className="flex items-center gap-3 border border-emerald-200 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-colors">
              {d.type === "pdf" ? (
                <>
                  <File className="w-4 h-4 text-emerald-600" />
                  <span className="flex-1 font-medium text-emerald-800 truncate">{d.file.name}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-200 px-2 py-1 rounded">PDF</span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 text-purple-600" />
                  <span className="flex-1 font-medium text-emerald-800">Mermaid Diagram</span>
                  <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded">Mermaid</span>
                </>
              )}
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleRemove(idx)} 
                type="button"
                className="hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {diagrams.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic">
              <BarChart3 className="w-8 h-8 mx-auto mb-2" />
              <p>No diagrams uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(diagrams.length / 20) * 100}%` }}
          ></div>
        </div>
        <span>{diagrams.length}/20</span>
      </div>
    </div>
  );
}
