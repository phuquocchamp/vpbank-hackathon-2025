import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number | string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your markdown content here...",
  disabled = false,
  height = 400
}) => {
  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <div className="w-full markdown-editor-wrapper" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        height={height}
        hideToolbar={false}
        textareaProps={{
          disabled,
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }
        }}
        data-color-mode="light"
      />
    </div>
  );
};

export default MarkdownEditor;
