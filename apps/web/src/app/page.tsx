import React from 'react';
import CanvasInterface from '@/components/organisms/CanvasInterface';
import {CanvasProvider} from '@/contexts/CanvasContext';

export default function Home() {
  return (
    <main className={"overflow-hidden h-screen max-h-screen w-screen max-w-screen"}>
        <CanvasProvider>
          <CanvasInterface />
        </CanvasProvider>
    </main>
  )
}
