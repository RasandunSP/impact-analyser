"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  Cloud, 
  Building2, 
  Server, 
  Database, 
  HardDrive, 
  Monitor, 
  Package, 
  Zap, 
  Settings, 
  Trash2, 
  Plus,
  Settings2
} from "lucide-react";

// Enhanced options with icons and colors
const deploymentOptions = [
  { value: "aws", label: "AWS", icon: Cloud, color: "text-emerald-600" },
  { value: "azure", label: "Azure", icon: Cloud, color: "text-purple-600" },
  { value: "alibaba", label: "Alibaba Cloud", icon: Cloud, color: "text-emerald-500" },
  { value: "gcp", label: "Google Cloud", icon: Cloud, color: "text-purple-500" },
  { value: "on-premise", label: "On-Premise", icon: Building2, color: "text-gray-600" },
  { value: "other", label: "Other", icon: Settings, color: "text-gray-500" }
];

const osOptions = [
  { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS", icon: Monitor, color: "text-emerald-600" },
  { value: "ubuntu-20.04", label: "Ubuntu 20.04 LTS", icon: Monitor, color: "text-emerald-600" },
  { value: "centos-8", label: "CentOS 8", icon: Monitor, color: "text-purple-600" },
  { value: "rhel-9", label: "Red Hat Enterprise Linux 9", icon: Monitor, color: "text-emerald-700" },
  { value: "windows-server-2022", label: "Windows Server 2022", icon: Monitor, color: "text-purple-600" },
  { value: "windows-server-2019", label: "Windows Server 2019", icon: Monitor, color: "text-purple-600" },
  { value: "macos-13", label: "macOS 13 Ventura", icon: Monitor, color: "text-gray-800" },
  { value: "macos-12", label: "macOS 12 Monterey", icon: Monitor, color: "text-gray-800" },
  { value: "debian-11", label: "Debian 11", icon: Monitor, color: "text-emerald-700" },
  { value: "other", label: "Other", icon: Monitor, color: "text-gray-500" }
];

const ramOptions = [
  { value: "1gb", label: "1 GB", icon: Database },
  { value: "2gb", label: "2 GB", icon: Database },
  { value: "4gb", label: "4 GB", icon: Database },
  { value: "8gb", label: "8 GB", icon: Database },
  { value: "16gb", label: "16 GB", icon: Database },
  { value: "32gb", label: "32 GB", icon: Database },
  { value: "64gb", label: "64 GB", icon: Database },
  { value: "128gb", label: "128 GB", icon: Database },
  { value: "256gb", label: "256 GB", icon: Database },
  { value: "custom", label: "Custom", icon: Settings2 }
];

const diskOptions = [
  { value: "20gb-ssd", label: "20 GB SSD", icon: HardDrive },
  { value: "40gb-ssd", label: "40 GB SSD", icon: HardDrive },
  { value: "80gb-ssd", label: "80 GB SSD", icon: HardDrive },
  { value: "160gb-ssd", label: "160 GB SSD", icon: HardDrive },
  { value: "320gb-ssd", label: "320 GB SSD", icon: HardDrive },
  { value: "640gb-ssd", label: "640 GB SSD", icon: HardDrive },
  { value: "1tb-ssd", label: "1 TB SSD", icon: HardDrive },
  { value: "2tb-ssd", label: "2 TB SSD", icon: HardDrive },
  { value: "4tb-ssd", label: "4 TB SSD", icon: HardDrive },
  { value: "1tb-hdd", label: "1 TB HDD", icon: HardDrive },
  { value: "2tb-hdd", label: "2 TB HDD", icon: HardDrive },
  { value: "4tb-hdd", label: "4 TB HDD", icon: HardDrive },
  { value: "8tb-hdd", label: "8 TB HDD", icon: HardDrive },
  { value: "custom", label: "Custom", icon: Settings2 }
];

const typeOptions = [
  { value: "physical", label: "Physical Server", icon: Server, color: "text-gray-700" },
  { value: "virtual", label: "Virtual Machine", icon: Server, color: "text-purple-600" },
  { value: "container", label: "Container", icon: Package, color: "text-emerald-600" },
  { value: "serverless", label: "Serverless", icon: Zap, color: "text-purple-600" },
  { value: "other", label: "Other", icon: Settings, color: "text-gray-500" }
];

export type Server = {
  deployment: string;
  ram: string;
  os: string;
  disk: string;
  type: string;
  customRam?: string;
  customDisk?: string;
};

export default function ServerDetailsForm({ servers, onChange }: { servers: Server[]; onChange: (servers: Server[]) => void }) {
  const handleChange = (idx: number, field: keyof Server, value: string) => {
    const updated = servers.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    onChange(updated);
  };

  const handleCustomRamChange = (idx: number, value: string) => {
    const updated = servers.map((s, i) => (i === idx ? { ...s, customRam: value } : s));
    onChange(updated);
  };

  const handleCustomDiskChange = (idx: number, value: string) => {
    const updated = servers.map((s, i) => (i === idx ? { ...s, customDisk: value } : s));
    onChange(updated);
  };

  const handleAdd = () => onChange([...servers, { deployment: "", ram: "", os: "", disk: "", type: "" }]);
  const handleRemove = (idx: number) => onChange(servers.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-6">
      {servers.map((server, idx) => (
        <div key={idx} className="flex flex-col gap-4 border-2 border-purple-200 p-6 rounded-lg relative bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-lg text-gray-800">Server {idx + 1}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deployment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Deployment Platform
              </label>
              <Select value={server.deployment} onValueChange={v => handleChange(idx, "deployment", v)}>
              <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deployment platform..." />
              </SelectTrigger>
              <SelectContent>
                  {deploymentOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            </div>

            {/* Server Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Server Type
              </label>
            <Select value={server.type} onValueChange={v => handleChange(idx, "type", v)}>
              <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select server type..." />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* RAM */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Database className="w-4 h-4" />
                RAM
              </label>
              <Select value={server.ram} onValueChange={v => handleChange(idx, "ram", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select RAM..." />
                </SelectTrigger>
                <SelectContent>
                  {ramOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {server.ram === "custom" && (
                <Input
                  placeholder="Enter custom RAM (e.g., 24GB)"
                  value={server.customRam || ""}
                  onChange={e => handleCustomRamChange(idx, e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Disk */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Storage
              </label>
              <Select value={server.disk} onValueChange={v => handleChange(idx, "disk", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select storage..." />
                </SelectTrigger>
                <SelectContent>
                  {diskOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {server.disk === "custom" && (
                <Input
                  placeholder="Enter custom storage (e.g., 500GB NVMe)"
                  value={server.customDisk || ""}
                  onChange={e => handleCustomDiskChange(idx, e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Operating System */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Operating System
              </label>
              <Select value={server.os} onValueChange={v => handleChange(idx, "os", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select operating system..." />
              </SelectTrigger>
              <SelectContent>
                  {osOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 hover:bg-red-700"
            onClick={() => handleRemove(idx)}
            disabled={servers.length === 1}
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={handleAdd} 
        type="button"
        className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-colors border-emerald-200"
      >
        <Plus className="w-4 h-4" />
        Add Server
      </Button>
    </div>
  );
}
