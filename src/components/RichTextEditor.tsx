'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { Node, mergeAttributes } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';

const lowlight = createLowlight(common);

const Caption = Node.create({
  name: 'caption',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p.caption' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { class: 'caption' }), 0];
  },
});

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Image,
      Caption,
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkInputRef = useRef<HTMLInputElement>(null);

  const openLinkInput = () => {
    const existing = editor?.getAttributes('link').href ?? '';
    setLinkUrl(existing);
    setShowLinkInput(true);
    setTimeout(() => linkInputRef.current?.focus(), 0);
  };

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const cancelLink = () => {
    setShowLinkInput(false);
    setLinkUrl('');
  };

  // Sync external value changes (e.g. when editing an existing article loads)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = '';

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/articles/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } finally {
      setUploading(false);
    }
  };

  if (!editor) return null;

  const btn = (label: string, action: () => void, active: boolean, disabled = false) => (
    <button
      type="button"
      onClick={action}
      className={`rte-btn${active ? ' rte-btn--active' : ''}`}
      title={label}
      disabled={disabled}
    >
      {label}
    </button>
  );

  return (
    <div className="rte-wrapper">
      <div className="rte-toolbar">
        {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
        <span className="rte-divider" />
        {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
        <span className="rte-divider" />
        {btn('• List', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {btn('1. List', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        <span className="rte-divider" />
        {editor.isActive('link')
          ? btn('Unlink', () => editor.chain().focus().unsetLink().run(), true)
          : btn('Link', openLinkInput, false)
        }
        {showLinkInput && (
          <span className="rte-link-input">
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              placeholder="https://..."
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') cancelLink();
              }}
              className="rte-link-url"
            />
            <button type="button" onClick={applyLink} className="rte-btn">Apply</button>
            <button type="button" onClick={cancelLink} className="rte-btn">✕</button>
          </span>
        )}
        <span className="rte-divider" />
        {btn('`code`', () => editor.chain().focus().toggleCode().run(), editor.isActive('code'))}
        {btn('</>', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}
        {editor.isActive('codeBlock') && (
          <select
            className="rte-lang-select"
            value={editor.getAttributes('codeBlock').language ?? ''}
            onChange={e => editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value || null }).run()}
          >
            <option value="">plain</option>
            <option value="bash">Bash</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="css">CSS</option>
            <option value="go">Go</option>
            <option value="html">HTML</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL</option>
            <option value="typescript">TypeScript</option>
            <option value="xml">XML</option>
          </select>
        )}
        <span className="rte-divider" />
        {btn(uploading ? '…' : '🖼 Image', () => fileInputRef.current?.click(), false, uploading)}
        {btn('∑', () => editor.chain().focus().insertContent('$  $').run(), false)}
        {btn('Caption', () => {
          if (editor.isActive('caption')) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().setNode('caption').run();
          }
        }, editor.isActive('caption'))}
        <span className="rte-divider" />
        {btn('↩', () => editor.chain().focus().undo().run(), false)}
        {btn('↪', () => editor.chain().focus().redo().run(), false)}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />
      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
}
