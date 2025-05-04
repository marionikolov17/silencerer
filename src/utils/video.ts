import { Block } from '@/types/blocks';

export const fetchVideoFromBlocks = async (blocks: Block[]) => {
  const copiedBlocks = copyVideoBlocks(blocks);

  const mergedBuffer = mergeVideoBlocks(copiedBlocks);

  const videoBlob = new Blob([mergedBuffer], { type: 'video/mp4' });

  return videoBlob;
};

export const mergeVideoBlocks = (blocks: Block[]) => {
  // Calculate total length of all buffers
  const totalLength = blocks.reduce(
    (acc, block) => acc + block.buffer.byteLength,
    0,
  );

  // Create a new buffer with the total length
  const mergedBuffer = new Uint8Array(totalLength);

  // Copy each block's buffer into the merged buffer
  let offset = 0;
  for (const block of blocks) {
    mergedBuffer.set(new Uint8Array(block.buffer), offset);
    offset += block.buffer.byteLength;
  }

  return mergedBuffer;
};

const copyVideoBlocks = (blocks: Block[]) => {
  return blocks.map((block) => ({
    ...block,
    buffer: block.buffer.slice(0),
  }));
};
