import React, { useRef, useEffect, useState, useCallback } from 'react';

// ─── Theme ───────────────────────────────────────────────────────────────────
const EDITOR_COLORS = {
  // Surfaces
  canvas: '#faf9f6',
  chrome: '#f5f3ee',
  border: '#e7e5e0',
  divider: '#d7d3cd',

  // Text
  textPrimary: '#1c1917',
  textMuted: '#a8a29e',
  textSubtle: '#c2bdb5',
  textControl: '#57534e',

  // Accent (amber)
  accent: '#d97706',
  accentHover: '#b45309',
  accentBg: '#f59e0b1a', // amber-500 at 10% opacity

  // Button states
  btnActive: '#d97706',
  btnActiveFg: '#ffffff',
  btnHoverBg: '#e7e5e0',
  btnFg: '#78716c',

  // Input
  inputBg: '#ffffff',
  inputBorder: '#ddd9d3',

  // Focus ring
  focusRing: '#d97706',
  focusShadow: 'rgba(0,0,0,0.07)',
} as const;
// ─────────────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Walk up DOM from selection to find the nearest block-level tag
function getSelectionBlockTag(editor: HTMLDivElement): string {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 'p';
  let node: Node | null = sel.getRangeAt(0).startContainer;
  while (node && node !== editor) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName.toLowerCase();
      if (['h1', 'h2', 'h3', 'p'].includes(tag)) return tag;
    }
    node = node.parentNode;
  }
  return 'p';
}

// Check if the current selection is inside a list of a given type
function isInsideList(type: 'UL' | 'OL'): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  let node: Node | null = sel.getRangeAt(0).startContainer;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === type) return true;
    node = node.parentNode;
  }
  return false;
}

// Manually toggle a list — wraps selected block(s) or unwraps if already a list
function toggleList(editor: HTMLDivElement, type: 'insertUnorderedList' | 'insertOrderedList') {
  editor.focus();
  const listType = type === 'insertUnorderedList' ? 'UL' : 'OL';
  const alreadyInList = isInsideList(listType as 'UL' | 'OL');

  if (alreadyInList) {
    // Unwrap: replace list items with plain paragraphs
    document.execCommand(type, false, undefined);
  } else {
    // If inside the other list type, switch it first
    const otherType = type === 'insertUnorderedList' ? 'insertOrderedList' : 'insertUnorderedList';
    if (isInsideList(type === 'insertUnorderedList' ? 'OL' : 'UL')) {
      document.execCommand(otherType, false, undefined);
    }
    document.execCommand(type, false, undefined);
  }
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStates, setActiveStates] = useState({
    bold: false, italic: false, underline: false,
    strikeThrough: false, ul: false, ol: false,
  });
  const [activeBlock, setActiveBlock] = useState('p');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const updateCounts = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
  };

  const updateActiveStates = useCallback(() => {
    if (!editorRef.current || typeof document === 'undefined') return;
    setActiveBlock(getSelectionBlockTag(editorRef.current));
    setActiveStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      ul: isInsideList('UL'),
      ol: isInsideList('OL'),
    });
  }, []);

  // Sync external value → DOM (avoid caret-resetting on every keystroke)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
      updateCounts(value || '');
      updateActiveStates();
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
    updateCounts(editorRef.current.innerHTML);
    updateActiveStates();
  };

  // Generic inline command (bold, italic, etc.)
  const execInline = (cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, undefined);
    setTimeout(emitChange, 0);
  };

  // Format block (headings / paragraph)
  const execFormatBlock = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, `<${tag}>`);
    setTimeout(emitChange, 0);
  };

  // List toggle — uses manual helper above
  const execList = (type: 'insertUnorderedList' | 'insertOrderedList') => {
    if (!editorRef.current) return;
    toggleList(editorRef.current, type);
    setTimeout(emitChange, 0);
  };

  // Prevent toolbar clicks from stealing focus / dropping selection
  const preventBlur = (e: React.MouseEvent) => e.preventDefault();

  // ── Derived styles ────────────────────────────────────────────────────────
  const containerShadow = isFocused
    ? `0 0 0 2px ${EDITOR_COLORS.focusRing}, 0 4px 24px 0 ${EDITOR_COLORS.focusShadow}`
    : `0 1px 4px 0 rgba(0,0,0,0.06), 0 0 0 1.5px ${EDITOR_COLORS.border}`;

  const getBtnStyle = (active: boolean): React.CSSProperties => ({
    width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? EDITOR_COLORS.btnActive : 'transparent',
    color: active ? EDITOR_COLORS.btnActiveFg : EDITOR_COLORS.btnFg,
  });

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: containerShadow, background: EDITOR_COLORS.canvas }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', borderBottom: `1px solid ${EDITOR_COLORS.border}`, background: EDITOR_COLORS.chrome }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: EDITOR_COLORS.accent }}>
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: EDITOR_COLORS.textMuted }}>Article</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: EDITOR_COLORS.textMuted }}>
          <span><b style={{ color: EDITOR_COLORS.textControl, fontWeight: 600 }}>{wordCount}</b> words</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span><b style={{ color: EDITOR_COLORS.textControl, fontWeight: 600 }}>{charCount}</b> chars</span>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div
        onMouseDown={preventBlur}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '6px 12px', borderBottom: `1px solid ${EDITOR_COLORS.border}`, background: EDITOR_COLORS.chrome, alignItems: 'center', userSelect: 'none' }}
      >
        {/* Inline formatting */}
        {([['bold', 'B', 'font-bold'], ['italic', 'I', 'italic'], ['underline', 'U', 'underline'], ['strikeThrough', 'S', 'line-through']] as const).map(([cmd, label, style]) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execInline(cmd); }}
            style={{
              ...getBtnStyle(activeStates[cmd as keyof typeof activeStates] as boolean),
              fontWeight: style === 'font-bold' ? 700 : 400,
              fontStyle: style === 'italic' ? 'italic' : 'normal',
              textDecoration: ['underline', 'line-through'].includes(style) ? style : 'none',
              fontSize: 13,
            }}
            title={cmd}
          >{label}</button>
        ))}

        <div style={{ width: 1, height: 20, background: EDITOR_COLORS.divider, margin: '0 6px' }} />

        {/* Block format */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b5b0a8' }}>Style</span>
          <select
            value={activeBlock}
            onChange={(e) => execFormatBlock(e.target.value)}
            style={{ background: EDITOR_COLORS.inputBg, border: `1px solid ${EDITOR_COLORS.inputBorder}`, borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600, color: EDITOR_COLORS.textControl, outline: 'none', cursor: 'pointer' }}
          >
            <option value="p">Body</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
        </div>

        <div style={{ width: 1, height: 20, background: EDITOR_COLORS.divider, margin: '0 6px' }} />

        {/* Lists */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execList('insertUnorderedList'); }}
          style={getBtnStyle(activeStates.ul)}
          title="Bullet List"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
            <circle cx="4" cy="10" r="1.5" fill="currentColor" />
            <circle cx="4" cy="14" r="1.5" fill="currentColor" />
            <path d="M8 6h9M8 10h9M8 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execList('insertOrderedList'); }}
          style={getBtnStyle(activeStates.ol)}
          title="Numbered List"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M3 5.5h1.5v4M3 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12.5c0-.8.6-1 1.2-1 .7 0 1.3.3 1.3 1s-.5 1-1.2 1.1C3.5 13.7 3 14 3 14.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 6h8M9 10h8M9 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ width: 1, height: 20, background: EDITOR_COLORS.divider, margin: '0 6px' }} />

        {/* Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b5b0a8' }}>Color</span>
          <label style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Text Color">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L14.5 14H12.5L11.5 11.5H8.5L7.5 14H5.5L10 3Z" fill={EDITOR_COLORS.btnFg} />
              <rect x="4" y="16" width="12" height="2" rx="1" fill={EDITOR_COLORS.accent} />
            </svg>
            <input type="color" onChange={(e) => { editorRef.current?.focus(); document.execCommand('foreColor', false, e.target.value); setTimeout(emitChange, 0); }} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
          </label>
        </div>
      </div>

      {/* ── Content editable ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        style={{
          minHeight: 320,
          padding: '2rem 2.5rem',
          outline: 'none',
          overflowY: 'auto',
          background: EDITOR_COLORS.canvas,
          color: EDITOR_COLORS.textPrimary,
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: 16,
          lineHeight: 1.85,
          caretColor: EDITOR_COLORS.accent,
        }}
      />

      {/* ── Bottom bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 16px', borderTop: `1px solid ${EDITOR_COLORS.border}`, background: EDITOR_COLORS.chrome }}>
        <span style={{ fontSize: 11, color: EDITOR_COLORS.textSubtle }}>Rich text editor</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isFocused ? EDITOR_COLORS.accent : EDITOR_COLORS.divider, display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: EDITOR_COLORS.textSubtle }}>{isFocused ? 'Editing' : 'Ready'}</span>
        </div>
      </div>

    </div>
  );
}