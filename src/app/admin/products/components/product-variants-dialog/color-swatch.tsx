'use client';

// ============ ColorSwatch ============

interface ColorSwatchProps {
  color?: string;
}

export function ColorSwatch({ color }: ColorSwatchProps) {
  if (!color) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="block h-4 w-4 shrink-0 rounded-sm border border-border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="font-mono text-[11px] text-muted-foreground">
        {color.toUpperCase()}
      </span>
    </div>
  );
}
