import React, { useState, memo, useCallback } from "react";
import { downloadImage, copyToClipboard } from "../utils/canvasHelpers";

interface ActionButtonsProps {
  composedImageUrl: string | null;
}

export const ActionButtons = memo(function ActionButtons({
  composedImageUrl,
}: ActionButtonsProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleDownload = useCallback(() => {
    if (!composedImageUrl) return;

    const timestamp = new Date().getTime();
    const filename = `dacongming-${timestamp}.jpg`;
    downloadImage(composedImageUrl, filename);
  }, [composedImageUrl]);

  const handleCopy = useCallback(async () => {
    if (!composedImageUrl) return;

    try {
      await copyToClipboard(composedImageUrl);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 3000);
    } catch (err) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  }, [composedImageUrl]);

  const disabled = !composedImageUrl;

  return (
    <div className="action-buttons">
      <button
        onClick={handleDownload}
        disabled={disabled}
        className="action-button download-button"
      >
        下载图片
      </button>

      <button
        onClick={handleCopy}
        disabled={disabled}
        className="action-button copy-button"
      >
        {copyStatus === "success"
          ? "已复制！"
          : copyStatus === "error"
            ? "复制失败"
            : "复制到剪贴板"}
      </button>

      {copyStatus === "error" && (
        <p className="copy-error-hint">复制失败，请使用下载功能</p>
      )}
    </div>
  );
});
