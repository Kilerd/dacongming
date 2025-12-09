import React, { memo, useCallback } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png'];

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onTextChange: (text: string) => void;
  text: string;
  disabled?: boolean;
}

export const UploadSection = memo(function UploadSection({
  onFileSelect,
  onTextChange,
  text,
  disabled = false,
}: UploadSectionProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      alert('请上传 JPG 或 PNG 格式的图片');
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('图片文件过大，请上传小于 10MB 的图片');
      e.target.value = '';
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div className="upload-section">
      <div className="input-group">
        <label htmlFor="image-upload" className="input-label">
          上传图片：
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          disabled={disabled}
          className="file-input"
        />
      </div>

      <div className="input-group">
        <label htmlFor="text-input" className="input-label">
          输入文字：
        </label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入文字内容"
          disabled={disabled}
          className="text-input"
        />
      </div>
    </div>
  );
});
