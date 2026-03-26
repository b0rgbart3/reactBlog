'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { Node, mergeAttributes } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';

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
    extensions: [StarterKit, Underline, Image, Caption],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
