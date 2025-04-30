import { Block } from '@/types/blocks';
import { encodeWAV } from './encoding';

interface DecodedBlock extends Omit<Block, 'buffer'> {
  buffer: AudioBuffer;
}

export const decodeAudioBuffer = async (buffer: ArrayBuffer) => {
  const copiedBuffer = buffer.slice(0);
  const audioContext = new AudioContext();
  return await audioContext.decodeAudioData(copiedBuffer);
};

export const fetchAudioFromBlocks = async (blocks: Block[]) => {
  const copiedBlocks = copyAudioBlocks(blocks);

  const decodedBlocks = await decodeAudioBlocks(copiedBlocks);

  const mergedBuffer = mergeDecodedAudioBlocks(decodedBlocks);

  const wavBlob = encodeWAV(mergedBuffer);

  return { blob: wavBlob, buffer: mergedBuffer };
};

const mergeDecodedAudioBlocks = (decodedBlocks: DecodedBlock[]) => {
  const audioContext = new AudioContext();
  const sampleRate = audioContext.sampleRate;

  const decodedBuffers = decodedBlocks.map((block) => block.buffer);

  const totalLength = decodedBuffers.reduce(
    (acc, buffer) => acc + buffer.length,
    0,
  );

  const mergedBuffer = audioContext.createBuffer(1, totalLength, sampleRate);
  const mergedData = mergedBuffer.getChannelData(0);
  let offset = 0;

  for (const buffer of decodedBuffers) {
    const data = buffer.getChannelData(0);
    mergedData.set(data, offset);
    offset += data.length;
  }

  return mergedBuffer;
};

const decodeAudioBlocks = async (blocks: Block[]): Promise<DecodedBlock[]> => {
  const audioContext = new AudioContext();

  const audioBlocks = await Promise.all(
    blocks.map(async (block) => {
      const audioBuffer = await audioContext.decodeAudioData(block.buffer);
      return {
        ...block,
        buffer: audioBuffer,
      };
    }),
  );

  return audioBlocks;
};

const copyAudioBlocks = (blocks: Block[]) => {
  return blocks.map((block) => ({
    ...block,
    buffer: block.buffer.slice(0),
  }));
};
