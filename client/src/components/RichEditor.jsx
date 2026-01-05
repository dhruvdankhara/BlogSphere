import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";
import apiClient from "../api";
import { marked } from "marked";

const turndown = new TurndownService({ headingStyle: "atx" });

export default function RichEditor({ value, setValue }) {
  const initialHTMLRef = useRef(null);
  const fileInputRef = useRef();
  if (initialHTMLRef.current === null) {
    try {
      initialHTMLRef.current = value ? marked.parse(value) : "";
    } catch {
      initialHTMLRef.current = value || "";
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-h-96 object-cover my-4 ring-1 ring-gray-300",
        },
      }),
      Placeholder.configure({ placeholder: "Write your story..." }),
    ],
    content: initialHTMLRef.current,
    editorProps: {
      attributes: {
        class: "prose prose-gray max-w-none min-h-[320px] focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const md = turndown.turndown(html);
      setValue(md);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor)
    return (
      <div className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-500">
        Loading editor...
      </div>
    );

  const addImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await apiClient.post("/upload", formData);
      editor.chain().focus().setImage({ src: res.data.data.imageUrl }).run();
    } catch (e) {
      console.error("Image upload failed", e);
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        await addImage(file);
      }
    }
  };

  const triggerFile = () => fileInputRef.current?.click();

  const buttonBase =
    "px-2 py-1 text-xs md:text-sm rounded-lg font-medium transition-colors";
  const activeBtn = "bg-blue-100 text-blue-700";
  const inactiveBtn = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  // eslint-disable-next-line react/prop-types
  const BarButton = ({ cmd, isActive, label }) => (
    <button
      type="button"
      onClick={cmd}
      className={`${buttonBase} ${isActive ? activeBtn : inactiveBtn}`}
    >
      {label}
    </button>
  );

  return (
    <div
      onPaste={handlePaste}
      className="w-full rounded-xl border border-gray-300 bg-white shadow-sm"
    >
      <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2">
        <BarButton
          label="B"
          isActive={editor.isActive("bold")}
          cmd={() => editor.chain().focus().toggleBold().run()}
        />
        <BarButton
          label="I"
          isActive={editor.isActive("italic")}
          cmd={() => editor.chain().focus().toggleItalic().run()}
        />
        <BarButton
          label="U"
          isActive={editor.isActive("underline")}
          cmd={() =>
            editor.chain().focus().toggleHighlight({ color: "#ffc078" }).run()
          }
        />
        <BarButton
          label="H1"
          isActive={editor.isActive("heading", { level: 1 })}
          cmd={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <BarButton
          label="H2"
          isActive={editor.isActive("heading", { level: 2 })}
          cmd={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <BarButton
          label="H3"
          isActive={editor.isActive("heading", { level: 3 })}
          cmd={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <BarButton
          label=">"
          isActive={editor.isActive("blockquote")}
          cmd={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <BarButton
          label="{ }"
          isActive={editor.isActive("codeBlock")}
          cmd={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <BarButton
          label="•"
          isActive={editor.isActive("bulletList")}
          cmd={() => editor.chain().focus().toggleBulletList().run()}
        />
        <BarButton
          label="1."
          isActive={editor.isActive("orderedList")}
          cmd={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (!url) return;
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`${buttonBase} ${editor.isActive("link") ? activeBtn : inactiveBtn}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Unlink
        </button>
        <button
          type="button"
          onClick={triggerFile}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Redo
        </button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => addImage(e.target.files?.[0])}
      />
    </div>
  );
}

RichEditor.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
