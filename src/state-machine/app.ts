import { createActorContext } from '@xstate/react';
import { assign, fromPromise, setup } from 'xstate';
import { VALID_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/files';
import {
  checkIfFileExists,
  isFileVideo,
  renameDuplicateFile,
} from '../utils/files';
import { Block, BlockType } from '@/types/blocks';

type AppContext = {
  files: File[];
  blocks: Block[];
};

type AppEvent =
  | { type: 'event.import_media'; files: File[] }
  | { type: 'event.remove_media'; fileName: string }
  | { type: 'event.rename_media'; fileName: string; newName: string }
  | { type: 'event.load_file'; buffer: ArrayBuffer; file: File }
  | { type: 'event.delete_block'; blockId: string };

const appMachine = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppEvent,
  },
  actors: {
    importMediaActor: fromPromise(
      async ({ input }: { input: { files: File[]; context: AppContext } }) => {
        const files = [];

        for (const file of input.files) {
          if (
            VALID_FILE_TYPES.includes(file.type) &&
            file.size <= MAX_FILE_SIZE
          ) {
            const newFile = new File(
              [file],
              renameDuplicateFile(file.name, input.context.files),
              {
                type: file.type,
              },
            );
            files.push(newFile);
          }
        }

        return { files };
      },
    ),
    removeMediaActor: fromPromise(
      async ({
        input,
      }: {
        input: { fileName: string; context: AppContext };
      }) => {
        const files = input.context.files.filter(
          (file) => file.name !== input.fileName,
        );
        return { files };
      },
    ),
    renameMediaActor: fromPromise(
      async ({
        input,
      }: {
        input: { fileName: string; newName: string; context: AppContext };
      }) => {
        const files = input.context.files.map((file, index) => {
          if (
            file.name === input.fileName &&
            !checkIfFileExists(input.newName, index, input.context.files)
          ) {
            return new File([file], input.newName, { type: file.type });
          }
          return file;
        });
        return { files };
      },
    ),
    loadFileActor: fromPromise(
      async ({ input }: { input: { buffer: ArrayBuffer; file: File } }) => {
        return {
          buffer: input.buffer,
          name: input.file.name,
          type: isFileVideo(input.file) ? BlockType.Video : BlockType.Audio,
        };
      },
    ),
    deleteBlockActor: fromPromise(
      async ({
        input,
      }: {
        input: { blockId: string; context: AppContext };
      }) => {
        return {
          blocks: input.context.blocks.filter(
            (block) => block.id !== input.blockId,
          ),
        };
      },
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0sAuyB2EARgJ4DEYAbmHthgJYC2qA9gE7YD6DkdyA2gAYAuolAtYdbHWZ5RIAB6IAzACYlGAQDYVAVgA0IYogAsARhUYAnFoGWA7GZWnbxgL6uDaTDnxEylalpWMAZmKi4efmE5cUlpWSQFZVNNK00ADjt9Q0R00wwdd090LFwCEnIqGgxgvGRuCIheQRFE2KkZOUUEDJ0MUztTTOyjBCUBfMt0pRS7JSzpuwE7IpAveiY2KTwoRt5SCBkwejwKZgBrY-XGFnY6Hb3kBHuzgGNkDrwWlpjmCU+usoBH1bPMRogVHYLMYdOMlEpjMYoZodJpVtdNncHtwmshyKxWGwMKgADYfABmbAYGAxt22uxxvGep2Y70+32ibT+cU6iW64xBljBBlGShRGGMWnMdksKksGSy6JKwVCFHuDMiByOJzOlxpypCYXVj2Zbw+8Q5rTE3IBfKBguFOQQphmVks7s0lmM6RUxic6XSSswKqN2M1YAJRNJFKp+uDhrVYdxptZ5pklt+-3igLGwI0QqyIohvqssK0Snl3uMYKDNWo9WNjLxhzwxxeFyuBrqDEbkRTbItwh+XKzvNA3V6-UGwyLCBUtg042WKnSQrMOhUtdqDaT+wjhNYxLJ2EprGp623Pd3T3bA-TQ851tHCXHiAyqR0plRulnKXyZecBFnHdeFN1WPBmAgOA5C8TMeRfJIEAAWk0WcUNrHxylGJ94JzHRPynIZCydOUBAwJQdDyDdTAGARvVrG4tl7XE4NtV8ECRcjzHBMZPQwOw8gEH0v1AgQlC3BNmN4VjsztDiVF-Ow7AwH10jozIbB0JEJO7KTkBksdEMsGj+KInj50sfjUW0CYEW0TQXXcdwgA */
  id: 'app',
  initial: 'standby',
  context: {
    files: [],
    blocks: [],
  },
  states: {
    standby: {
      on: {
        'event.import_media': {
          target: 'importing_media',
        },
        'event.remove_media': {
          target: 'removing_media',
        },
        'event.rename_media': {
          target: 'renaming_media',
        },
        'event.load_file': {
          target: 'loading_file',
        },
        'event.delete_block': {
          target: 'deleting_block',
        },
      },
    },
    importing_media: {
      invoke: {
        src: 'importMediaActor',
        input: ({ event, context }) => {
          if (event.type === 'event.import_media') {
            return { files: event.files, context };
          }
          throw new Error('Invalid event type for importing media');
        },
        onDone: {
          target: 'standby',
          actions: [
            assign({
              files: ({ context, event }) => [
                ...context.files,
                ...event.output.files,
              ],
            }),
          ],
        },
        onError: {
          target: 'standby',
        },
      },
    },
    removing_media: {
      invoke: {
        src: 'removeMediaActor',
        input: ({ event, context }) => {
          if (event.type === 'event.remove_media') {
            return { fileName: event.fileName, context };
          }
          throw new Error('Invalid event type for removing media');
        },
        onDone: {
          target: 'standby',
          actions: [
            assign({
              files: ({ event }) => event.output.files,
            }),
          ],
        },
        onError: {
          target: 'standby',
        },
      },
    },
    renaming_media: {
      invoke: {
        src: 'renameMediaActor',
        input: ({ event, context }) => {
          if (event.type === 'event.rename_media') {
            return {
              fileName: event.fileName,
              newName: event.newName,
              context,
            };
          }
          throw new Error('Invalid event type for renaming media');
        },
        onDone: {
          target: 'standby',
          actions: [assign({ files: ({ event }) => event.output.files })],
        },
        onError: {
          target: 'standby',
        },
      },
    },
    loading_file: {
      invoke: {
        src: 'loadFileActor',
        input: ({ event }) => {
          if (event.type === 'event.load_file') {
            return { buffer: event.buffer, file: event.file };
          }
          throw new Error('Invalid event type for loading file');
        },
        onDone: {
          target: 'standby',
          actions: [
            assign({
              blocks: ({ context, event }) => [
                ...context.blocks,
                {
                  id: crypto.randomUUID(),
                  type: event.output.type,
                  buffer: event.output.buffer,
                  name: event.output.name,
                },
              ],
            }),
          ],
        },
        onError: {
          target: 'standby',
        },
      },
    },
    deleting_block: {
      invoke: {
        src: 'deleteBlockActor',
        input: ({ event, context }) => {
          if (event.type === 'event.delete_block') {
            return { blockId: event.blockId, context };
          }
          throw new Error('Invalid event type for deleting block');
        },
        onDone: {
          target: 'standby',
          actions: [assign({ blocks: ({ event }) => event.output.blocks })],
        },
        onError: {
          target: 'standby',
        },
      },
    },
  },
});

export const AppMachineContext = createActorContext(appMachine);
