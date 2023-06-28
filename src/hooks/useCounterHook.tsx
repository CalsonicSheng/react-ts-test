import { useEffect, useState } from "react";

// we have confirmed that THE SAME customized hooks function when called under DIFFERENT MULTIPLE COMPONENTS are only local to the TARGET component where it is called
// all the states/logics written under the customized hooks ARE LOCAL TO THE COMPONENT WHERE THE HOOK IS CALLED
// if "useEffect" is also called under the customized hooks, it STILL FOLLOWS THE RULE OF "RUN AFTER ALL ELEMENTS AND CHILD COMPONENTS ARE RENDERED" UNDER THE TARGET COMPONENT WHERE THE
// CUSTOMIZED HOOK IS CALLED.
// also, we have tested that only when the state IS UPDATED, THEN THE TARGET COMPONENT WILL RE-RENDER | NOT WHEN THE STATE UPDATE FUNCTION IS CALLED THAT GIVES THE SAME STATE VALUE
// "re-rendering" only happens under the target component where the associated STATE IS DECLARED WHEN IT IS UPDATED TO DIFFERENT VALUE (EVEN IF THE STATE IS NOT USED AFTER DECLARATION)
// COMPONENT RENDEREDING IS VERY COMPONENT-SPECIFIC, ONLY THE STATE THAT IS ORIGINALLY DECLARED TO A SPECIFIC COMPONENT, WILL TRIGGER COMPONENT RE-RENDER IF THEIR VALUE IS UPDATED
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
