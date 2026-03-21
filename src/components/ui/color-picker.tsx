'use client';

import { useState, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils/utils';

// ── Helpers ──────────────────────────────────────────────
/** Chuẩn hoá hex string: loại ký tự không hợp lệ + tối đa 6 ký tự. */
const sanitizeHex = (raw: string) =>
  raw
    .replace(/[^0-9a-fA-F]/g, '')
    .slice(0, 6)
    .toUpperCase();

/** Kiểm tra hex 6 ký tự hợp lệ để truyền vào react-colorful. */
const isFullHex = (h: string) => /^[0-9a-fA-F]{6}$/.test(h);

// ── Types ────────────────────────────────────────────────
export interface ColorPickerProps {
  /** Giá trị màu hiện tại dạng `#RRGGBB` (có thể undefined/rỗng). */
  value?: string;
  /** Callback khi màu thay đổi — trả về `#RRGGBB` hoặc `''` khi clear. */
  onChange?: (color: string) => void;
  /** Placeholder khi chưa chọn màu. */
  placeholder?: string;
  /** Vô hiệu hóa component */
  disabled?: boolean;
  /** Class bổ sung cho trigger button */
  className?: string;
  /** Cho phép clear màu về rỗng */
  allowClear?: boolean;
}

// ── Component ────────────────────────────────────────────
export function ColorPicker({
  value = '',
  onChange,
  placeholder = 'Chọn màu',
  disabled = false,
  className,
  allowClear = true,
}: ColorPickerProps) {
  // hex string không có '#', e.g. "FF5733"
  const [hexInput, setHexInput] = useState(() =>
    sanitizeHex((value || '').replace('#', '')),
  );
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Giá trị màu hợp lệ để preview & truyền vào picker
  const normalizedHex = sanitizeHex((value || '').replace('#', ''));
  const pickerColor = isFullHex(normalizedHex)
    ? `#${normalizedHex}`
    : '#000000';

  // ── Handlers ──
  /** react-colorful callback — luôn trả `#rrggbb` */
  const handlePickerChange = useCallback(
    (hex: string) => {
      const clean = sanitizeHex(hex.replace('#', ''));
      setHexInput(clean);
      onChange?.(hex); // hex là #rrggbb
    },
    [onChange],
  );

  /** Người dùng gõ/paste vào text input */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = sanitizeHex(e.target.value);
      setHexInput(raw);
      if (isFullHex(raw)) {
        onChange?.(`#${raw}`);
      } else if (raw === '') {
        onChange?.('');
      }
    },
    [onChange],
  );

  /** Xử lý paste thủ công để tránh bị maxLength cắt */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text');
      const raw = sanitizeHex(pasted.replace('#', ''));
      setHexInput(raw);
      if (isFullHex(raw)) {
        onChange?.(`#${raw}`);
      }
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    // khi blur, sync lại hexInput từ value prop
    setHexInput(sanitizeHex((value || '').replace('#', '')));
  }, [value]);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHexInput('');
      onChange?.('');
    },
    [onChange],
  );

  const hasColor = isFullHex(normalizedHex);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-2 text-sm',
            'hover:border-primary-pink/60 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-primary-pink',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          {/* Swatch */}
          <span
            className={cn(
              'block h-5 w-5 shrink-0 rounded-sm border border-border shadow-sm transition-colors',
              !hasColor && 'bg-muted',
            )}
            style={hasColor ? { backgroundColor: pickerColor } : undefined}
          />

          {/* Hex text */}
          <span
            className={cn(
              'flex-1 text-left font-mono text-sm',
              hasColor ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {hasColor ? `#${normalizedHex.toUpperCase()}` : placeholder}
          </span>

          {/* Clear button */}
          {allowClear && hasColor && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 space-y-3" align="start">
        {/* Gradient picker */}
        <HexColorPicker
          color={pickerColor}
          onChange={handlePickerChange}
          style={{ width: '200px' }}
        />

        {/* Hex text input */}
        <div className="flex items-center gap-1.5 rounded-md border border-input px-2 h-8 focus-within:ring-1 focus-within:ring-primary-pink bg-background">
          <span className="text-xs text-muted-foreground font-mono select-none">
            #
          </span>
          <input
            ref={inputRef}
            type="text"
            value={hexInput}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onBlur={handleBlur}
            placeholder="RRGGBB"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-sm font-mono uppercase outline-none placeholder:text-muted-foreground tracking-wider"
          />
          {/* Live swatch */}
          {isFullHex(hexInput) && (
            <span
              className="h-4 w-4 shrink-0 rounded-sm border border-border"
              style={{ backgroundColor: `#${hexInput}` }}
            />
          )}
        </div>

        {/* Preset colors */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              title={preset}
              className="h-6 w-6 rounded-sm border border-border shadow-sm hover:scale-110 transition-transform focus:outline-none focus:ring-1 focus:ring-primary-pink"
              style={{ backgroundColor: preset }}
              onClick={() => {
                const clean = sanitizeHex(preset.replace('#', ''));
                setHexInput(clean);
                onChange?.(preset);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Preset palette ────────────────────────────────────────
const PRESET_COLORS = [
  '#000000',
  '#FFFFFF',
  '#F43F5E',
  '#EC4899',
  '#A855F7',
  '#6366F1',
  '#3B82F6',
  '#06B6D4',
  '#10B981',
  '#84CC16',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#14B8A6',
  '#F97316',
];
