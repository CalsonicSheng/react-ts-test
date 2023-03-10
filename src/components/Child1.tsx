import React, { ReactElement, useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { useCounterHook } from '../hooks/useCounterHook';

export default function Child1({ a, b }: { a: number; b: number }): ReactElement {
  console.log('child1 component run');

  // context type here must match with the type we defined previously (very important)
  const sharedContext: null | { parentGlobalState: number; setParentGlobalState: React.Dispatch<React.SetStateAction<number>> } = useContext(GlobalStateContext);

  const { counter, setCounterHandler } = useCounterHook('Child1');

  return (
    <div style={{ marginRight: '120px' }}>
      <h1>Child 1 component</h1>
      <button onClick={setCounterHandler} style={{ marginRight: '10px' }}>
        add +
      </button>
      <span>count state: {counter}</span>
      <h3>context shared state: {sharedContext?.parentGlobalState}</h3>
      <button
        onClick={() => {
          sharedContext?.setParentGlobalState((preState: number): number => {
            return preState + 1;
          });
        }}
      >
        change global context state
      </button>
    </div>
  );
}
