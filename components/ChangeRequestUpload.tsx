"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  File, 
  FileText, 
  Plus, 
  Trash2, 
  Upload,
  Lightbulb,
  ClipboardList
} from "lucide-react";

export type ChangeRequest = { type: "file"; file: File } | { type: "text"; text: string } | null;

export default function ChangeRequestUpload({ value, onChange }: { value: ChangeRequest; onChange: (cr: ChangeRequest) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onChange({ type: "file", file: files[0] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddText = () => {
    if (text.trim()) {
      onChange({ type: "text", text: text.trim() });
      setText("");
    }
  };

  const handleRemove = () => onChange(null);

  return (
    <div className="flex flex-col gap-6">
      {/* File Upload Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <File className="w-4 h-4 text-emerald-600" />
          Upload Change Request File
        </label>
        <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 bg-emerald-50 hover:bg-emerald-100 transition-colors">
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,text/plain,.doc,.docx"
            onChange={handleFileChange}
            disabled={!!value}
            className="border-0 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
          />
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <Upload className="w-3 h-3" />
            Supported formats: PDF, TXT, DOC, DOCX
          </p>
        </div>
      </div>

      {/* Text Input Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          Or Enter Change Request Text
        </label>
        <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 bg-purple-50">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Describe your change request here...&#10;Include details about:&#10;- What needs to be changed&#10;- Why the change is needed&#10;- Expected impact&#10;- Timeline requirements"
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-1 border-0 bg-transparent resize-none"
              rows={5}
              disabled={!!value}
            />
            <Button 
              onClick={handleAddText} 
              type="button" 
              disabled={!text.trim() || !!value}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Current Change Request Display */}
      {value && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            Current Change Request
          </label>
          <div className="border-2 border-purple-200 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center gap-3">
              {value.type === "file" ? (
                <>
                  <File className="w-4 h-4 text-emerald-600" />
                  <span className="flex-1 font-medium text-purple-800 truncate">{value.file.name}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-200 px-2 py-1 rounded">File</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="flex-1 font-medium text-purple-800">Text Request</span>
                  <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded">Text</span>
                </>
              )}
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemove} 
                type="button"
                className="hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {value.type === "text" && (
              <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{value.text}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!value && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div className="text-sm text-emerald-800">
              <h4 className="font-semibold mb-2">Change Request Guidelines:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Upload a file or enter text describing the proposed changes</li>
                <li>• Include clear objectives and expected outcomes</li>
                <li>• Specify any technical requirements or constraints</li>
                <li>• Mention potential risks and mitigation strategies</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
