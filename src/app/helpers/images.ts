export const isImageUrl = (url: string): boolean =>
  /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
