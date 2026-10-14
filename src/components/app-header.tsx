import React from 'react';

const isDemo = process.env.NEXT_PUBLIC_DEMO === 'true';

export function AppHeader() {
  return (
    <header className="mb-10 pl-2 flex items-center gap-4 flex-wrap">
      <h1 className="text-[1.35rem] font-semibold tracking-tight text-foreground">Reporting + Analytics Coverage</h1>
      {isDemo && (
        <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/60 px-3 py-1 text-xs text-amber-900">
          <span><strong>Demo:</strong> sample data. Your changes stay in this tab and reset on refresh.</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-medium underline underline-offset-2 hover:text-amber-950 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </header>
  );
}
