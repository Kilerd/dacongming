export interface CompositionConfig {
  backgroundUrl: string;
  userImage: File;
  text: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CompositionResult {
  composedImageUrl: string | null;
  isProcessing: boolean;
  error: string | null;
}
