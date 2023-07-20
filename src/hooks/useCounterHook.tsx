import { useEffect, useState } from "react";

// all the states/logics written under the customized hooks ARE LOCAL TO THE COMPONENT WHERE THE HOOK IS CALLED
// if "useEffect" is also called under the customized hooks, it STILL FOLLOWS THE RULE OF "RUN AFTER ALL ELEMENTS AND CHILD COMPONENTS ARE RENDERED" UNDER THE TARGET COMPONENT WHERE THE
// CUSTOMIZED HOOK IS CALLED.
// also we have tested that target component re-rendering only happens if the state declared under such target component is updated to different value (not when update function is called everytime).
// "re-rendering" ONLY happens when the associated STATE IS DECLARED WHEN IT IS UPDATED TO DIFFERENT VALUE (EVEN IF THE STATE IS NOT USED AFTER DECLARATION).
// react "re-rendering" will ONLY trigger the TARGET COMPONENT where that state variable IS ORIGINALLY DECLARED to re-render (First) + any child components that is under the target component.

// Additional state management notes:
// When a state or prop changes, React schedules a re-render, during which it constructs a new react virtual DOM, then it compares this tree with the previous one, and then it updates the
// actual DOM to match the new tree (This process is optimized to minimize the actual DOM operations, which are expensive)
// Batching state update: multiple state updates in React can occur in a batch through a event handling or lifecycle methods call under a single re-render instead of multiple ones to optimize performance.
// Batching state update does not perform for the dependent state update, which means the state update function will use the latest state value BEFORE UPDATE, but not the latest state value
// after the state update function is called.

export function useCounterHook(componentTitle: string): { counter: number; setCounterHandler: () => void } {
  console.log(`${componentTitle} useCounterHook run`);

  const [counter, setCounter] = useState<number>(1);

  function setCounterHandler(): void {
    setCounter((preState: number): number => {
      return preState + 1;
    });
  }

  useEffect(() => {
    console.log(`${componentTitle} useCounterHook's useEffect run`);
  }, []);

  return { counter, setCounterHandler };
}
