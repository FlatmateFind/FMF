'use client';
import { useState, KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  /** Custom items already added */
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  /** All currently-selected standard items — used to prevent duplicates */
  existingSelected?: string[];
}

export default function CustomTagInput({
  items,
  onChange,
  placeholder = 'Add custom item…',
  existingSelected = [],
}: Props) {
  const [input, setInput] = useState('');

  function add() {
    const val = input.trim();
    if (!val) return;
    const lower = val.toLowerCase();
    const duplicate =
      items.some((i) => i.toLowerCase() === lower) ||
      existingSelected.some((i) => i.toLowerCase() === lower);
    if (duplicate) { setInput(''); return; }
    onChange([...items, val]);
    setInput('');
  }

  function remove(item: string) {
    onChange(items.filter((i) => i !== item));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* Added custom tags */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-sm font-medium"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                className="w-4 h-4 rounded-full bg-teal-200 hover:bg-teal-300 flex items-center justify-center transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X className="w-2.5 h-2.5 text-teal-700" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          maxLength={60}
          placeholder={placeholder}
          className="flex-1 text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5">Press Enter or click Add to include a custom item</p>
    </div>
  );
}
