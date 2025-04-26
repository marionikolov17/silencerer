import { createActorContext } from '@xstate/react';
import { assign, fromPromise, setup } from 'xstate';
import { VALID_FILE_TYPES } from '@/constants/file-types';

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
      async ({ input }: { input: { files: File[] } }) => {
        // TODO: Add a guard for valid files and sizes
        const files = input.files.filter((file) =>
          VALID_FILE_TYPES.includes(file.type),
        );

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
        input: ({ event }) => ({ files: event.files }),
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
