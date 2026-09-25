"use client";

import { useEffect, useMemo, useState } from "react";
import { Library, Search, FileSpreadsheet, Loader2 } from "lucide-react";

// Bibliothèque d'Alexandria : la liste des CSV analysables, servie par le serveur local
// (ADAM/FORGE/csv-bibliotheque/serveur.py, GET /api/csv). Un clic charge le fichier par
// le même chemin qu'un fichier glissé (onFileLoaded). Si le serveur local n'est pas là
// (site déployé ailleurs), le composant ne s'affiche pas.

interface CsvEntry {
  id: string;
  groupe: string;
  nom: string;
  fichier: string;
  lignes: number;
  octets: number;
}

interface CsvLibraryProps {
  onFileLoaded: (content: string, fileName: string) => void;
}

export function CsvLibrary({ onFileLoaded }: CsvLibraryProps) {
  const [entries, setEntries] = useState<CsvEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csv", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CsvEntry[] | null) => setEntries(Array.isArray(data) ? data : null))
      .catch(() => setEntries(null));
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (entries ?? []).filter(
      (e) => !q || e.nom.toLowerCase().includes(q) || e.fichier.toLowerCase().includes(q),
    );
    const byGroup = new Map<string, CsvEntry[]>();
    for (const e of filtered) {
      byGroup.set(e.groupe, [...(byGroup.get(e.groupe) ?? []), e]);
    }
    return [...byGroup.entries()];
  }, [entries, query]);

  if (!entries || entries.length === 0) return null;

  const open = async (entry: CsvEntry) => {
    setLoadingId(entry.id);
    setError(null);
    try {
      const r = await fetch(`/api/csv/${encodeURIComponent(entry.id)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      onFileLoaded(await r.text(), entry.fichier);
    } catch (e) {
      setError(`Impossible de charger ${entry.nom} (${(e as Error).message})`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-card animate-fade-in mt-6 p-6 text-left">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-2.5">
            <Library className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <p className="font-medium text-white">Bibliothèque d&apos;Alexandria</p>
            <p className="text-sm text-gray-400">{entries.length} CSV — un clic pour analyser</p>
          </div>
        </div>
        <label className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un CSV…"
            className="w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/60 md:w-64"
          />
        </label>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className="max-h-96 space-y-5 overflow-y-auto pr-1">
        {groups.map(([groupe, items]) => (
          <div key={groupe}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{groupe}</p>
            <ul className="space-y-1.5">
              {items.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => open(e)}
                    disabled={loadingId !== null}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 disabled:opacity-60"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {loadingId === e.id ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-300" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 shrink-0 text-gray-400" />
                      )}
                      <span className="truncate text-sm text-white">{e.nom}</span>
                    </span>
                    <span className="shrink-0 text-xs text-gray-500">{e.lignes} lignes</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {groups.length === 0 && <p className="text-sm text-gray-500">Aucun CSV ne correspond.</p>}
      </div>
    </div>
  );
}
