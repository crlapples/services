// src/types/image.ts
export interface Image {
    id?: string; // Optional Firestore ID
    url: string; // Direct URL (Firebase Storage or external)
    alt?: string; // Optional alt text
    width?: number; // Original width
    height?: number; // Original height
  }