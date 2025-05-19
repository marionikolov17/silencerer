export type Block = {
  id: string;
  name: string;
  type: BlockType;
  buffer: ArrayBuffer;
};

export enum BlockType {
  Audio = 'audio',
  Video = 'video',
}
