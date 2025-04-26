import { createActorContext } from '@xstate/react';
import { assign, fromPromise, setup } from 'xstate';
import { VALID_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/files';
import { renameDuplicateFile } from '../utils/files';

type AppContext = {
  files: File[];
};

type AppEvent = { type: 'event.import_media'; files: File[] };

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
      },
    },
    importing_media: {
      invoke: {
        src: 'importMediaActor',
        input: ({ event, context }) => ({ files: event.files, context }),
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
  },
});

export const AppMachineContext = createActorContext(appMachine);
