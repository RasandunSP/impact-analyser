"use client";
import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Building2, Server, Network } from "lucide-react";

const architectures = [
  { value: "client-server", label: "Client-Server", icon: Server, color: "text-purple-600" },
  { value: "monolithic", label: "Monolithic", icon: Building2, color: "text-gray-700" },
  { value: "microservices", label: "Microservices", icon: Network, color: "text-emerald-600" },
];

export default function ArchitectureDropdown({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Select Architecture Type
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-2 border-emerald-200 focus:border-emerald-400">
          <SelectValue placeholder="Choose your system architecture..." />
        </SelectTrigger>
        <SelectContent>
          {architectures.map((arch) => {
            const IconComponent = arch.icon;
            return (
              <SelectItem key={arch.value} value={arch.value} className="flex items-center gap-2">
                <IconComponent className={`w-4 h-4 ${arch.color}`} />
                <span>{arch.label}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
