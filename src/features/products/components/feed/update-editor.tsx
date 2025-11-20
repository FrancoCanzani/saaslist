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
        heading: {
          levels: [2, 3],
        },
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
      transformPastedText(text) {
        // Enable markdown paste
        return text;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    parseOptions: {
      preserveWhitespace: "full",
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
    <div className="space-y-2">
      <div className="border rounded border-input bg-background">
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-muted-foreground">
        You can use Markdown formatting: **bold**, *italic*, `code`, # heading, - lists, etc.
      </p>
    </div>
  );
}

