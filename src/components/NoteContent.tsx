import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

// constants
import { NOTES_LABELS } from "../constants";

// utils
import { debounce } from "../utils";

const NoteContent: React.FC<{
  isHtml?: boolean;
  height: number;
  text: string;
  onTextChange: (id: string, text: string) => void;
  setNoteHeight: (id: string, height: number) => void;
  id: string;
}> = ({ text, onTextChange, setNoteHeight, id, height, isHtml }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editedText, setEditedText] = useState<string>(text);

  // Sync local state with prop changes (for when data updates from API/Redux)
  useEffect(() => {
    setEditedText(text);
  }, [text]);

  const debouncedTextChange = useRef(
    debounce((id: string, value: string) => {
      onTextChange(id, value);
    }, 1000),
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
    debouncedTextChange(id, e.target.value);
  };

  useEffect(() => {
    const targetRef = isHtml ? editorContainerRef : textareaRef;

    if (targetRef.current) {
      let previousHeight = targetRef.current.offsetHeight;

      const debouncedSetHeight = debounce(() => {
        if (targetRef.current) {
          const newHeight = targetRef.current.offsetHeight;
          if (newHeight !== previousHeight) {
            setNoteHeight(id, newHeight);
            previousHeight = newHeight;
          }
        }
      }, 1000);

      const resizeObserver = new ResizeObserver(() => {
        debouncedSetHeight();
      });

      resizeObserver.observe(targetRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHtml]);

  return !isHtml ? (
    <textarea
      style={{ height: height ? `${height}px` : "auto" }}
      ref={textareaRef}
      value={editedText}
      onChange={handleChange}
      className="note-content-textarea"
      placeholder={NOTES_LABELS.createNotePlaceholder}
    />
  ) : (
    <div ref={editorContainerRef}>
      <Editor
        apiKey={import.meta.env.VITE_TINY_MCE}
        value={editedText}
        onEditorChange={(content) => {
          setEditedText(content);
          debouncedTextChange(id, content);
        }}
        init={{
          branding: false,
          height: height || 300,
          resize: true,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #333; }",
          skin: "oxide",
          content_css: "default",
        }}
      />
    </div>
  );
};
export default NoteContent;
