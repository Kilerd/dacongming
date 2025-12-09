import React, { memo } from "react";

interface CompositionCanvasProps {
  composedImageUrl: string | null;
  error: string | null;
}

export const CompositionCanvas = memo(function CompositionCanvas({
  composedImageUrl,
  error,
}: CompositionCanvasProps) {
  if (error) {
    return (
      <div className="canvas-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  if (!composedImageUrl) {
    return (
      <div className="canvas-container">
        <div className="placeholder-message">
          <p>请上传图片并输入文字</p>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <img
        src={composedImageUrl}
        alt="Composed result"
        className="composed-image"
      />
    </div>
  );
});
