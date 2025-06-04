import { Block } from '@/types/blocks';
import { FileFormat, mimeTypes } from '@/types/file-formats';
import Merge from './merge';
import Encoder from './encoder';

class Export {
  private format: FileFormat;
  private quality: number;
  private name: string;
  private normalize: boolean;
  private blocks: Block[];

  constructor(
    format: FileFormat,
    quality: number,
    name: string,
    normalize: boolean,
    blocks: Block[],
  ) {
    this.format = format;
    this.quality = quality;
    this.name = name;
    this.normalize = normalize;
    this.blocks = blocks;
  }

  public async export() {
    let mergedBuffer: AudioBuffer | ArrayBuffer | null = null;
    let encodedBuffer: ArrayBuffer | null = null;

    switch (this.format) {
      case FileFormat.WAV:
        mergedBuffer = await this.mergeAudioBlocks();
        encodedBuffer = await Encoder.encodeWAV(mergedBuffer);
        break;
      default:
        break;
    }

    if (!encodedBuffer) {
      throw new Error('Failed to encode buffer');
    }

    const blob = new Blob([encodedBuffer], { type: mimeTypes[this.format] });

    return blob;
  }

  private async mergeAudioBlocks() {
    const mergedBuffer = await Merge.mergeAudioBlocksBuffers(this.blocks);
    return mergedBuffer;
  }
}

export default Export;
