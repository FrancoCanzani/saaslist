"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface UpdateEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function UpdateEditor({
  content,
  onChange,
  placeholder = "What's new?",
}: UpdateEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded border-input bg-background">
      <div className="flex gap-1 p-2 border-b border-input">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs rounded hover:bg-muted ${
            editor.isActive("bold") ? "bg-muted" : ""
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs rounded hover:bg-muted ${
            editor.isActive("italic") ? "bg-muted" : ""
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-xs rounded hover:bg-muted ${
            editor.isActive("bulletList") ? "bg-muted" : ""
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-xs rounded hover:bg-muted ${
            editor.isActive("orderedList") ? "bg-muted" : ""
          }`}
        >
          1.
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

