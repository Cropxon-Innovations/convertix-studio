import { useState } from "react";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { 
  Code, Copy, Check, ArrowRightLeft, 
  Clock, Download, Lock, Braces, FileJson,
  Binary, Regex, CheckCircle, AlertCircle
} from "lucide-react";

const categories = [
  { id: "developer", label: "Developer" },
  { id: "qa", label: "QA" },
  { id: "devops", label: "DevOps" },
];

const tools = {
  developer: [
    { id: "json-yaml", label: "JSON ↔ YAML", icon: FileJson },
    { id: "base64", label: "Base64", icon: Binary },
    { id: "json-format", label: "JSON Format", icon: Braces },
  ],
  qa: [
    { id: "regex", label: "Regex Tester", icon: Regex },
    { id: "json-validate", label: "JSON Validate", icon: CheckCircle },
  ],
  devops: [
    { id: "yaml-validate", label: "YAML Validate", icon: CheckCircle },
    { id: "env-parse", label: "ENV Parser", icon: Code },
  ]
};

const DeveloperStudio = () => {
  const [activeCategory, setActiveCategory] = useState("developer");
  const [activeTool, setActiveTool] = useState("json-yaml");
  const [input, setInput] = useState('{\n  "name": "CONVERTIX",\n  "version": "1.0.0",\n  "features": ["documents", "images", "developer"]\n}');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoggedIn] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleTransform = () => {
    try {
      if (activeTool === 'json-yaml') {
        const parsed = JSON.parse(input);
        // Simple JSON to YAML conversion
        const toYaml = (obj: unknown, indent = 0): string => {
          const spaces = '  '.repeat(indent);
          if (Array.isArray(obj)) {
            return obj.map(item => `${spaces}- ${typeof item === 'object' ? '\n' + toYaml(item, indent + 1) : item}`).join('\n');
          }
          if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj).map(([key, value]) => {
              if (typeof value === 'object') {
                return `${spaces}${key}:\n${toYaml(value, indent + 1)}`;
              }
              return `${spaces}${key}: ${value}`;
            }).join('\n');
          }
          return String(obj);
        };
        setOutput(toYaml(parsed));
        setIsValid(true);
      } else if (activeTool === 'base64') {
        setOutput(btoa(input));
        setIsValid(true);
      } else if (activeTool === 'json-format') {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
        setIsValid(true);
      } else if (activeTool === 'json-validate') {
        JSON.parse(input);
        setOutput('✓ Valid JSON');
        setIsValid(true);
      } else {
        setOutput(input);
        setIsValid(true);
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
      setIsValid(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTools = tools[activeCategory as keyof typeof tools] || [];

  return (
    <StudioLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Categories & Tools */}
          <aside className="w-64 border-r border-border/50 bg-card/50 p-4 hidden lg:flex flex-col">
            {/* Categories */}
            <div className="flex gap-1 mb-6 p-1 bg-accent/50 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const firstTool = tools[cat.id as keyof typeof tools]?.[0];
                    if (firstTool) setActiveTool(firstTool.id);
                  }}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tools */}
            <div className="space-y-1">
              {currentTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tool.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1" />

            {/* Session Info */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Session temporary</span>
              </div>
            </div>
          </aside>

          {/* Center - Editor */}
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Input */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border/50">
              <div className="h-10 border-b border-border/50 flex items-center justify-between px-4">
                <span className="text-sm text-muted-foreground">Input</span>
                <Button 
                  size="sm" 
                  onClick={handleTransform}
                  className="h-7"
                >
                  <ArrowRightLeft className="h-3 w-3 mr-2" />
                  Transform
                </Button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
                placeholder="Paste your input here..."
                spellCheck={false}
              />
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col">
              <div className="h-10 border-b border-border/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Output</span>
                  {isValid !== null && (
                    isValid ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleCopy}
                  disabled={!output}
                  className="h-7"
                >
                  {copied ? (
                    <Check className="h-3 w-3 mr-2" />
                  ) : (
                    <Copy className="h-3 w-3 mr-2" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="flex-1 p-4 font-mono text-sm bg-card/30 overflow-auto whitespace-pre-wrap">
                {output || <span className="text-muted-foreground">Output will appear here...</span>}
              </pre>
            </div>
          </main>

          {/* Right Sidebar - Options */}
          <aside className="w-64 border-l border-border/50 bg-card/50 p-4 hidden xl:flex flex-col">
            <h3 className="text-sm font-medium text-foreground mb-4">Options</h3>

            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-accent/50">
                <p className="font-medium text-foreground mb-1">Current Tool</p>
                <p className="text-muted-foreground capitalize">
                  {activeTool.replace('-', ' → ')}
                </p>
              </div>
            </div>

            <div className="flex-1" />

            {/* Download/Save */}
            <div className="pt-4 border-t border-border/50">
              {isLoggedIn ? (
                <Button variant="outline" className="w-full" disabled={!output}>
                  <Download className="mr-2 h-4 w-4" />
                  Save Snippet
                </Button>
              ) : (
                <div className="p-4 rounded-lg bg-accent/50 text-center">
                  <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Sign in to save snippets
                  </p>
                  <Button size="sm" className="w-full">
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Timeline Bar */}
        <div className="h-14 border-t border-border/50 bg-card/50 flex items-center px-6 gap-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">History</span>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full w-0 bg-primary rounded-full transition-all" />
          </div>
          <span className="text-sm text-muted-foreground">
            {isLoggedIn ? 'Synced' : 'Not saved'}
          </span>
        </div>
      </div>
    </StudioLayout>
  );
};

export default DeveloperStudio;
