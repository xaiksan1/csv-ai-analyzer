"use client";

import { Sparkles, Database, ChevronDown, Github } from "lucide-react";
import { FileUpload } from "../FileUpload";
import { CsvLibrary } from "../CsvLibrary";
import { APIKeyButton } from "../APIKeySettings";
import { CSVSettingsButton } from "../CSVSettings";
import { SAMPLE_DATASETS } from "~/lib/sample-data";
import type { CSVSettings } from "~/lib/csv-parser";
import type { StoredSettings } from "~/lib/storage";

interface HeroProps {
  csvSettings: CSVSettings;
  apiSettings: StoredSettings | null;
  currentFileName: string | undefined;
  showSampleDropdown: boolean;
  onSettingsChange: (settings: CSVSettings) => void;
  onApiSettingsChange: (settings: StoredSettings | null) => void;
  onFileLoaded: (content: string, fileName: string) => void;
  onClearFile: () => void;
  onLoadSample: (datasetId: string) => void;
  onToggleSampleDropdown: () => void;
}

export function Hero({
  csvSettings,
  apiSettings,
  currentFileName,
  showSampleDropdown,
  onSettingsChange,
  onApiSettingsChange,
  onFileLoaded,
  onClearFile,
  onLoadSample,
  onToggleSampleDropdown,
}: HeroProps) {
  return (
    <div>
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-3 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent">
                CSV AI Analyzer
              </h1>
              <p className="text-gray-400">
                Intelligent data analysis powered by AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/maxgfr/csv-ai-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-gray-600 bg-gray-700 px-4 py-2.5 font-medium text-white shadow-lg shadow-gray-700/25 transition-all duration-200 hover:bg-gray-600"
              title="View source code on GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="hidden text-sm sm:inline">Source Code</span>
            </a>
            <CSVSettingsButton
              settings={csvSettings}
              onSettingsChange={onSettingsChange}
            />
            <APIKeyButton
              onSettingsChange={onApiSettingsChange}
              currentSettings={apiSettings}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Analyze your CSV files with AI in seconds
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
            Upload your data, choose your AI provider (OpenAI, Anthropic,
            Google, and more), and get intelligent insights and chart
            suggestions.
            <span className="font-semibold text-violet-400">
              {" "}
              100% private
            </span>{" "}
            when using a self-hosted/custom endpoint.
          </p>
        </div>

        {/* Upload Section */}
        <div id="upload-section" className="mx-auto mb-12 max-w-4xl">
          <FileUpload
            onFileLoaded={onFileLoaded}
            currentFileName={currentFileName}
            onClear={onClearFile}
          />

          {/* Bibliothèque d'Alexandria : choisir un CSV au lieu de le glisser */}
          {!currentFileName && <CsvLibrary onFileLoaded={onFileLoaded} />}

          {/* Sample Data Loader */}
          <div className="animate-fade-in mt-6 flex items-center justify-center gap-3">
            <span className="text-sm text-gray-500">Or try a sample:</span>
            <div className="relative">
              <button
                onClick={onToggleSampleDropdown}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10"
              >
                <Database className="h-4 w-4" />
                Load Sample Data
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showSampleDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {showSampleDropdown && (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-56 overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
                  <div className="py-1">
                    {SAMPLE_DATASETS.map((dataset) => (
                      <button
                        key={dataset.id}
                        onClick={() => onLoadSample(dataset.id)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {dataset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
