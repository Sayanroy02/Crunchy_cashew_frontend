import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        ul: false,
        ol: false,
    });
    const [activeBlock, setActiveBlock] = useState('p');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    // Detect active block by walking up the DOM from the selection
    const getActiveBlockTag = (): string => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return 'p';
        let node: Node | null = sel.getRangeAt(0).startContainer;
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = (node as Element).tagName.toLowerCase();
                if (['h1', 'h2', 'h3', 'p', 'div'].includes(tag)) return tag === 'div' ? 'p' : tag;
            }
            node = node.parentNode;
        }
        return 'p';
    };

    const updateActiveStates = useCallback(() => {
        if (typeof document === 'undefined') return;
        setActiveBlock(getActiveBlockTag());
        setActiveStates({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            ul: document.queryCommandState('insertUnorderedList'),
            ol: document.queryCommandState('insertOrderedList'),
        });
    }, []);

    const updateCounts = (html: string) => {
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        setCharCount(text.length);
        setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
    };

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
        updateActiveStates();
        updateCounts(value || '');
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            updateCounts(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    // Always focus editor first, then exec — critical for list/format commands
    const execCommand = (command: string, val: string = '') => {
        editorRef.current?.focus();
        document.execCommand(command, false, val || undefined);
        // Defer state read so DOM settles first
        setTimeout(() => {
            handleInput();
            updateActiveStates();
        }, 0);
    };

    // formatBlock needs angle-bracket wrapped tag name
    const handleFormatBlock = (tag: string) => {
        editorRef.current?.focus();
        document.execCommand('formatBlock', false, `<${tag}>`);
        setTimeout(() => {
            handleInput();
            updateActiveStates();
        }, 0);
    };

    const getBtnClass = (isActive: boolean, extraClasses: string = '') => {
        return `relative w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 text-sm ${isActive
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-200 hover:text-stone-800'
            } ${extraClasses}`;
    };

    return (
        <div
            className={`rounded-2xl overflow-hidden transition-all duration-300 ${isFocused
                    ? 'shadow-[0_0_0_2px_#d97706,0_4px_24px_0_rgba(0,0,0,0.07)]'
                    : 'shadow-[0_1px_4px_0_rgba(0,0,0,0.06),0_0_0_1.5px_#e7e5e0]'
                }`}
            style={{ background: '#faf9f6' }}
        >
            {/* Top bar */}
            <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ borderColor: '#e7e5e0', background: '#f5f3ee' }}
            >
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-amber-600">
                        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#a8a29e', letterSpacing: '0.08em' }}>
                        Article
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#a8a29e' }}>
                    <span><b className="font-semibold text-stone-600">{wordCount}</b> words</span>
                    <span className="opacity-40">·</span>
                    <span><b className="font-semibold text-stone-600">{charCount}</b> chars</span>
                </div>
            </div>

            {/* Toolbar */}
            <div
                className="flex flex-wrap gap-0.5 px-3 py-2 border-b select-none items-center"
                style={{ background: '#f5f3ee', borderColor: '#e7e5e0' }}
            >
                {/* Text Style */}
                <div className="flex items-center gap-0.5 mr-1">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} className={getBtnClass(activeStates.bold, 'font-bold')} title="Bold">B</button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} className={getBtnClass(activeStates.italic, 'italic')} title="Italic">I</button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} className={getBtnClass(activeStates.underline, 'underline')} title="Underline">U</button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }} className={getBtnClass(activeStates.strikeThrough, 'line-through')} title="Strikethrough">S</button>
                </div>

                <div className="h-5 w-px mx-1.5" style={{ background: '#d7d3cd' }} />

                {/* Block Format */}
                <div className="flex items-center gap-1.5 mr-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b5b0a8' }}>Style</span>
                    <select
                        value={activeBlock}
                        onMouseDown={() => editorRef.current?.focus()}
                        onChange={(e) => handleFormatBlock(e.target.value)}
                        className="rounded-md px-2 py-1 text-xs font-semibold outline-none cursor-pointer transition-colors"
                        style={{
                            background: '#fff',
                            border: '1px solid #ddd9d3',
                            color: '#57534e',
                        }}
                    >
                        <option value="p">Body</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>

                <div className="h-5 w-px mx-1.5" style={{ background: '#d7d3cd' }} />

                {/* Lists — use onMouseDown + preventDefault to keep selection alive */}
                <div className="flex items-center gap-0.5 mr-1">
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
                        className={getBtnClass(activeStates.ul)}
                        title="Bullet List"
                    >
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                            <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                            <circle cx="4" cy="14" r="1.5" fill="currentColor" />
                            <path d="M8 6h9M8 10h9M8 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}
                        className={getBtnClass(activeStates.ol)}
                        title="Numbered List"
                    >
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                            <path d="M3 5.5h1.5v4M3 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 12.5c0-.8.6-1 1.2-1 .7 0 1.3.3 1.3 1s-.5 1-1.2 1.1C3.5 13.7 3 14 3 14.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 6h8M9 10h8M9 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="h-5 w-px mx-1.5" style={{ background: '#d7d3cd' }} />

                {/* Color */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b5b0a8' }}>Color</span>
                    <label
                        className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-stone-200"
                        title="Text Color"
                    >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M10 3L14.5 14H12.5L11.5 11.5H8.5L7.5 14H5.5L10 3Z" fill="currentColor" className="text-stone-500" />
                            <rect x="4" y="16" width="12" height="2" rx="1" fill="#d97706" />
                        </svg>
                        <input
                            type="color"
                            onChange={(e) => execCommand('foreColor', e.target.value)}
                            className="sr-only"
                        />
                    </label>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyUp={updateActiveStates}
                onMouseUp={updateActiveStates}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full outline-none overflow-y-auto"
                {...{ placeholder } as any}
                suppressContentEditableWarning
                style={{
                    minHeight: '320px',
                    padding: '2rem 2.5rem',
                    background: '#faf9f6',
                    color: '#1c1917',
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontSize: '16px',
                    lineHeight: '1.85',
                    caretColor: '#d97706',
                }}
            />

            {/* Bottom bar */}
            <div
                className="flex items-center justify-between px-4 py-1.5 border-t"
                style={{ borderColor: '#e7e5e0', background: '#f5f3ee' }}
            >
                <span className="text-[11px]" style={{ color: '#c2bdb5' }}>Rich text editor</span>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: isFocused ? '#d97706' : '#d7d3cd' }} />
                    <span className="text-[11px]" style={{ color: '#c2bdb5' }}>{isFocused ? 'Editing' : 'Ready'}</span>
                </div>
            </div>
        </div>
    );
}