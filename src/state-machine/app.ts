import { createActorContext } from '@xstate/react';
import { assign, fromPromise, setup } from 'xstate';
import { VALID_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/files';
import { checkIfFileExists, renameDuplicateFile } from '../utils/files';

type AppContext = {
  files: File[];
};

type AppEvent =
  | { type: 'event.import_media'; files: File[] }
  | { type: 'event.remove_media'; fileName: string }
  | { type: 'event.rename_media'; fileName: string; newName: string };

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
  },
}).createMachine({
  id: 'app',
  initial: 'standby',
  context: {
    files: [],
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
  },
});

export const AppMachineContext = createActorContext(appMachine);
