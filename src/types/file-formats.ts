export enum FileFormat {
  WAV = 'wav',
}

export const mimeTypes: Record<FileFormat, string> = {
  [FileFormat.WAV]: 'audio/wav',
};
