import { Block } from '@/types/blocks';

class Merge {
  public static mergeBlocksBuffers(blocks: Block[]) {
    const totalBufferLength = blocks.reduce(
      (acc, block) => acc + block.buffer.byteLength,
      0,
    );

    const mergedArrayBuffer = new ArrayBuffer(totalBufferLength);
    const mergedUint8Array = new Uint8Array(mergedArrayBuffer);

    let offset = 0;

    for (const block of blocks) {
      const blockBuffer = block.buffer;
      const blockBufferView = new Uint8Array(blockBuffer);

      mergedUint8Array.set(blockBufferView, offset);

      offset += blockBufferView.length;
    }

    return mergedUint8Array.buffer;
  }

  public static async mergeAudioBlocksBuffers(blocks: Block[]) {
    const copiedBlocks = this.copyBlocks(blocks);

    const audioContext = new AudioContext();
    const sampleRate = audioContext.sampleRate;

    const decodedBlocks = await Promise.all(
      copiedBlocks.map(async (block) => {
        const audioBuffer = await audioContext.decodeAudioData(
          block.buffer.slice(0),
        );
        return {
          ...block,
          buffer: audioBuffer,
        };
      }),
    );

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
  }

  public static copyBlocks(blocks: Block[]) {
    return blocks.map((block) => ({
      ...block,
      buffer: block.buffer.slice(0),
    }));
  }
}

export default Merge;
