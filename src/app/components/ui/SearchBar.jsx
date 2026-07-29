'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';

const SUGGESTIONS = [
  "Binary Search",
  "Merge Sort",
  "Tim Sort",
  "Linked List",
  "Graph BFS",
  "Dynamic Programming",
];

const SearchBar = ({ sections = [], onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filterSections = (queryText) => {
    const query = (queryText || '').toLowerCase().trim();
    if (!query) {
      if (typeof onSearchResults === 'function') {
        onSearchResults(sections);
      }
      return;
    }

    const filtered = sections
      .map((section) => {
        const sectionTitleMatch = section.title?.toLowerCase().includes(query);

        const subsectionMatches = section.subsections
          ?.map((subsection) => {
            const subsectionTitleMatch = subsection.title?.toLowerCase().includes(query);
            const itemMatches = subsection.items?.filter((item) =>
              item.name?.toLowerCase().includes(query)
            );
            return {
              ...subsection,
              items: subsectionTitleMatch ? subsection.items : itemMatches,
              isHighlighted: subsectionTitleMatch || (itemMatches && itemMatches.length > 0),
            };
          })
          .filter((subsection) => subsection.items && subsection.items.length > 0);

        const itemMatches = section.items?.filter((item) =>
          item.name?.toLowerCase().includes(query)
        );

        return {
          ...section,
          subsections: section.subsections ? subsectionMatches : undefined,
          items: section.subsections
            ? undefined
            : itemMatches && itemMatches.length > 0
            ? itemMatches
            : undefined,
          isHighlighted:
            sectionTitleMatch ||
            (subsectionMatches && subsectionMatches.length > 0) ||
            (itemMatches && itemMatches.length > 0),
        };
      })
      .filter(
        (section) =>
          section.isHighlighted ||
          (section.subsections && section.subsections.length > 0) ||
          (section.items && section.items.length > 0)
      );

    if (typeof onSearchResults === 'function') {
      onSearchResults(filtered);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowDropdown(true);
    filterSections(val);
  };

  const handleSelectSuggestion = (suggestionText) => {
    setSearchQuery(suggestionText);
    setShowDropdown(false);
    filterSections(suggestionText);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowDropdown(false);
    filterSections('');
  };

  const filteredSuggestions = SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="mt-4 max-w-2xl mx-auto relative">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search algorithms, data structures..."
          aria-label="Search algorithms and data structures"
          role="combobox"
          aria-expanded={showDropdown && filteredSuggestions.length > 0}
          className="w-full pl-6 pr-12 py-3.5 rounded-full border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-50 placeholder-surface-400 dark:placeholder-surface-500 text-[15px] transition-all shadow-sm"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-4 p-1 rounded-full text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <Search className="h-5 w-5 absolute right-5 text-surface-400 dark:text-surface-500 pointer-events-none" />
        )}
      </div>

      {showDropdown && searchQuery && filteredSuggestions.length > 0 && (
        <div
          role="listbox"
          className="absolute w-full mt-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-xl z-50 overflow-hidden"
        >
          {filteredSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={searchQuery === item}
              onClick={() => handleSelectSuggestion(item)}
              className="w-full text-left px-5 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
