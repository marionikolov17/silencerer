import { Block } from '@/types/blocks';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const fetchVideoFromBlocks = async (blocks: Block[]) => {
  if (blocks.length === 0) return new Uint8Array();

  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write each video block to a temporary file
  for (let i = 0; i < blocks.length; i++) {
    const blob = new Blob([blocks[i].buffer], { type: 'video/mp4' });
    await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(blob));
  }

  // Create a file list for concatenation
  const fileList = blocks.map((_, i) => `file input${i}.mp4`).join('\n');
  await ffmpeg.writeFile('filelist.txt', fileList);

  // Concatenate videos using FFmpeg
  await ffmpeg.exec([
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    'filelist.txt',
    '-c',
    'copy',
    'output.mp4',
  ]);

  // Read the concatenated video
  const data = await ffmpeg.readFile('output.mp4');
  return data as Uint8Array;
};
