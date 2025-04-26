'use client';

import LayoutHome from '@/components/LayoutHome';
import { AppMachineContext } from '@/state-machine/app';

export default function Home() {
  return (
    <AppMachineContext.Provider>
      <LayoutHome />
    </AppMachineContext.Provider>
  );
}
