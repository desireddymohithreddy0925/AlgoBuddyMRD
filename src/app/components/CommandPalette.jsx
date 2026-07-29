"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Code, FileText, BookOpen, LayoutDashboard, X } from "lucide-react";
import { SEARCH_INDEX, CATEGORIES } from "@/app/components/commandPaletteIndex";
import { supabase } from "@/lib/supabase";
import FocusTrap from "@/app/components/ui/FocusTrap";

// ── Icon mapping per category ────────────────────────────────────────────────
const CATEGORY_ICON = {
  "Code Lab":    Code,
  "Array":       Code,
  "Recursion":   Code,
  "Stack":       Code,
  "Queue":       Code,
  "Linked List": Code,
  "Tree":        Code,
  "Graph":       Code,
  "Hash Map":    Code,
  "Blog":        FileText,
  "Page":        LayoutDashboard,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Bold the portion of `text` that matches `query` */
function Highlighted({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-[#a435f0]/20 text-[#a435f0] rounded-[2px] px-[1px] not-italic font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

/** Filter SEARCH_INDEX by query string */
function filterResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX.slice(0, 8);                    // default: top 8
  return SEARCH_INDEX.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  ).slice(0, 20);
}

// ── Component ────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const [isOpen, setIsOpen]         = useState(false);
  const [query, setQuery]           = useState("");
  const [selectedIdx, setSelected]  = useState(0);
  const [supabaseBlogResults, setSupabaseBlogResults] = useState([]);
  const [isSearchingSupabase, setIsSearchingSupabase] = useState(false);
  
  const inputRef                    = useRef(null);
  const listRef                     = useRef(null);
  const router                      = useRouter();

  const staticResults = filterResults(query);

  // Merge static results and supabase results, avoiding duplicates by path
  const results = useMemo(() => {
    if (!query.trim()) return staticResults;
    const merged = [...staticResults];
    for (const post of supabaseBlogResults) {
      if (!merged.some((item) => item.path === post.path)) {
        merged.push(post);
      }
    }
    return merged.slice(0, 20);
  }, [staticResults, supabaseBlogResults, query]);

  // Debounced Supabase search for blog posts
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSupabaseBlogResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingSupabase(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("title, slug")
          .textSearch("title", q, { type: "websearch" })
          .limit(5);

        if (!error && data) {
          const mapped = data.map((post) => ({
            name: post.title,
            path: `/blog/${post.slug}`,
            category: "Blog",
          }));
          setSupabaseBlogResults(mapped);
        } else {
          setSupabaseBlogResults([]);
        }
      } catch (err) {
        console.error("Supabase blog search error:", err);
        setSupabaseBlogResults([]);
      } finally {
        setIsSearchingSupabase(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ── Open / close keyboard shortcut & custom event ─────────────────────────
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    function onOpenEvent() {
      setIsOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  // ── Focus input when opened; reset state ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelected(0);
      // nextTick to let dialog render first
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // ── Scroll selected item into view ────────────────────────────────────────
  useEffect(() => {
    const el = listRef.current?.children[selectedIdx];
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  // ── Navigate to selected item ─────────────────────────────────────────────
  const handleSelect = useCallback(
    (item) => {
      setIsOpen(false);
      router.push(item.path);
    },
    [router]
  );

  // ── Arrow-key / Enter navigation inside the input ─────────────────────────
  function handleInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[selectedIdx]) handleSelect(results[selectedIdx]);
    }
  }

  if (!isOpen) return null;

  // ── Build grouped results ─────────────────────────────────────────────────
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = results.filter((r) => r.category === cat);
    if (items.length) acc.push({ cat, items });
    return acc;
  }, []);

  return (
    <FocusTrap>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette — search AlgoBuddy"
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />

        {/* Palette card */}
        <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">

          {/* ── Search input row ── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Search
              size={18}
              className="shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={results.length > 0}
              aria-controls="command-palette-listbox"
              aria-activedescendant={results[selectedIdx] ? `cp-item-${selectedIdx}` : undefined}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search visualizers, pages, tutorials…"
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              aria-label="Search AlgoBuddy"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Escape hint */}
            <kbd
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 select-none"
              aria-label="Press Escape to close"
            >
              ESC
            </kbd>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
              className="sm:hidden p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

                    {/* ── Results ── */}
          <div
            id="command-palette-listbox"
            role="listbox"
            aria-label="Search results"
            ref={listRef}
            className="overflow-y-auto p-2 flex-1"
          >
            {grouped.length === 0 && !isSearchingSupabase ? (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400">No results</div>
            ) : (
              grouped.map(({ cat, items }) => {
                const Icon = CATEGORY_ICON[cat] || Search;
                return (
                  <div key={cat} className="mb-2">
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">{cat}</div>
                    {items.map((item, idx) => {
                      const globalIdx = results.indexOf(item);
                      return (
                        <button
                          id={`cp-item-${globalIdx}`}
                          key={item.path}
                          role="option"
                          aria-selected={selectedIdx === globalIdx}
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 ${selectedIdx === globalIdx ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
                        >
                          <Icon size={16} className="shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                              <Highlighted text={item.name} query={query} />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.path}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

        </div> {/* palette card */}
      </div> {/* dialog wrapper */}
    </FocusTrap>
  );
}
