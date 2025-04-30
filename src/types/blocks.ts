export type Block = {
  id: string;
  name: string;
  type: BlockType;
  buffer: ArrayBuffer;
};

export enum BlockType {
  Image = 'image',
  Video = 'video',
}
