import React, { useState, useCallback, useEffect } from "react";
import { UploadSection } from "./UploadSection";
import { CompositionCanvas } from "./CompositionCanvas";
import { ActionButtons } from "./ActionButtons";

import { composeImage } from "../utils/canvasHelpers";
const BACKGROUND_IMAGE_URL = "/bg.jpg";
export function ImageComposer() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if both image and text are provided
    if (!uploadedImage || !inputText.trim()) {
      setComposedImageUrl(null);
      setError(null);
      return;
    }

    let isMounted = true;

    const performComposition = async () => {
      setError(null);

      try {
        const result = await composeImage({
          backgroundUrl: BACKGROUND_IMAGE_URL,
          userImage: uploadedImage,
          text: inputText.trim(),
        });

        if (isMounted) {
          setComposedImageUrl(result);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Image composition failed";
          setError(errorMessage);
          setComposedImageUrl(null);
        }
      }
    };

    performComposition();

    return () => {
      isMounted = false;
    };
  }, [uploadedImage, inputText]);

  const handleFileSelect = useCallback((file: File) => {
    setUploadedImage(file);
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setInputText(text);
  }, []);

  return (
    <div className="image-composer">
      <h1 className="title">谁是大聪明？</h1>

      <UploadSection
        onFileSelect={handleFileSelect}
        onTextChange={handleTextChange}
        text={inputText}
      />
      <CompositionCanvas composedImageUrl={composedImageUrl} error={error} />

      <ActionButtons composedImageUrl={composedImageUrl} />
    </div>
  );
}
