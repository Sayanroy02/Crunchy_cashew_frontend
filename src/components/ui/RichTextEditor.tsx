import React, { useRef, useEffect, useState } from 'react';

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

    const updateActiveStates = () => {
        if (typeof document !== 'undefined') {
            const formatBlockVal = (document.queryCommandValue('formatBlock') || '').toLowerCase();
            setActiveBlock(formatBlockVal || 'p');
            setActiveStates({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough'),
                ul: document.queryCommandState('insertUnorderedList'),
                ol: document.queryCommandState('insertOrderedList'),
            });
        }
    };

    // Keep editor content in sync with external value, but avoid infinite loops during typing
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
        updateActiveStates();
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
    };

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        handleInput();
        updateActiveStates();
    };

    const getBtnClass = (isActive: boolean, extraClasses: string = '') => {
        return `p-1 rounded w-8 h-8 flex items-center justify-center transition-all ${
            isActive 
                ? 'bg-[#00863D] text-white font-bold shadow-sm' 
                : 'hover:bg-gray-200 text-gray-700'
        } ${extraClasses}`;
    };

    return (
        <div className="border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-primary transition-all bg-gray-50">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-100/80 border-b border-gray-200 select-none items-center">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className={getBtnClass(activeStates.bold, 'font-bold text-sm')}
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className={getBtnClass(activeStates.italic, 'italic text-sm')}
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className={getBtnClass(activeStates.underline, 'underline text-sm')}
                    title="Underline"
                >
                    U
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('strikeThrough')}
                    className={getBtnClass(activeStates.strikeThrough, 'line-through text-sm')}
                    title="Strikethrough"
                >
                    S
                </button>
                <div className="h-5 w-px bg-gray-300 self-center mx-1" />
                
                {/* Size Selector */}
                <div className="flex items-center gap-1.5 mr-1">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider ml-1">Size:</label>
                    <select
                        value={activeBlock}
                        onChange={(e) => execCommand('formatBlock', e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 font-semibold outline-none cursor-pointer hover:border-gray-300 transition-colors"
                    >
                        <option value="p">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>
                
                <div className="h-5 w-px bg-gray-300 self-center mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className={getBtnClass(activeStates.ul, 'text-[10px]')}
                    title="Bullet List"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className={getBtnClass(activeStates.ol, 'text-[10px]')}
                    title="Numbered List"
                >
                    1. List
                </button>
                <div className="h-5 w-px bg-gray-300 self-center mx-1" />
                {/* Color Picker */}
                <div className="flex items-center gap-1">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider ml-1">Color:</label>
                    <input
                        type="color"
                        onChange={(e) => execCommand('foreColor', e.target.value)}
                        className="w-6 h-6 border-none bg-transparent cursor-pointer rounded"
                        title="Text Color"
                    />
                </div>
            </div>

            {/* Content Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyUp={updateActiveStates}
                onMouseUp={updateActiveStates}
                className="w-full min-h-[250px] p-4 outline-none bg-white text-gray-800 text-sm overflow-y-auto leading-relaxed rounded-b-2xl border-t border-gray-100"
                {...{ placeholder } as any}
                style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            />
        </div>
    );
}
