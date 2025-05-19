'use client';

import LayoutHome from '@/components/LayoutHome';
import { AppMachineContext } from '@/state-machine/app';
import NoSSRWrapper from '@/components/utils/NoSSRWrapper';

export default function Home() {
  return (
    <NoSSRWrapper>
      <AppMachineContext.Provider>
        <LayoutHome />
      </AppMachineContext.Provider>
    </NoSSRWrapper>
  );
}
