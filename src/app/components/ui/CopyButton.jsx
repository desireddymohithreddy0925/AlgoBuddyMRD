'use client';

import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CopyButton({
  text,
  ariaLabel,
  title,
  className = '',
}) {
  const handleCopy = async () => {
    const value = String(text ?? '').trim();

    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy to clipboard.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel || 'Copy to clipboard'}
      title={title || ariaLabel || 'Copy to clipboard'}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-bold text-neutral-600 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a435f0]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:ring-offset-neutral-900 ${className}`}
    >
      <Copy className="h-3.5 w-3.5 shrink-0" />
      <span>Copy</span>
    </button>
  );
}