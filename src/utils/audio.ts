import { Block } from '@/types/blocks';
import { encodeWAV } from './encoding';
import Merge from './merge';

export const decodeAudioBuffer = async (buffer: ArrayBuffer) => {
  const copiedBuffer = buffer.slice(0);
  const audioContext = new AudioContext();
  return await audioContext.decodeAudioData(copiedBuffer);
};

export const fetchAudioFromBlocks = async (blocks: Block[]) => {
  const mergedBuffer = await Merge.mergeAudioBlocksBuffers(blocks);

  const wavBlob = encodeWAV(mergedBuffer);

  return { blob: wavBlob, buffer: mergedBuffer };
};
