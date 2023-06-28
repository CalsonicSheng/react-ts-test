import React, { ReactElement, useEffect, useState } from "react";
import Child1 from "./components/Child1";
// import Child2 from './components/Child2';
import Child2Object from "./components/Child2";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { useCounterHook } from "./hooks/useCounterHook";

// outside functional component code will only run once upon mounting and does not subject to react re-rendering process to re-execute these codes
// all declared variables (global) are accessible under the current functional component block under this file/module
// by convention, we must have modifiers ("const" or "let") for each declared variable (if not, then it will be treated as global variable under "window" object)
const title: string = "Parent Component";
const c1Props: { a: number; b: number } = { a: 5555, b: 6666 };
console.log("parent outside runs");

// ---------------------------------------------------------------------------------------------------------------------

function App(): ReactElement {
  console.log("parent component run");

  // again, all the "states" when declared are only locally accessible in the TARGET component where they declared and ARE NOT shareable/accessible by other child components.
  // any declared state when updated to ONLY DIFFERENT VALUE will trigger the target component to re-render NO MATTER IF THE STATE IS USED OR NOT AFTER DECLARATION.
  const [parentGlobalState, setParentGlobalState] = useState<number>(11111);
  const { counter, setCounterHandler } = useCounterHook("parent");

  // we have tested that all useEffect hooks' callback functions will ONLY RUN AFTER ALL elements + children components are fully rendered under COMPONENT WHERE THEY DECLARED
  // if there are two or more "useEffect" hooks, then all of their callback functions will run IN THE ORDER when they declared (no suprise here)
  useEffect(() => {
    console.log("parent useEffect run1");
  }, []);

  useEffect(() => {
    console.log("parent useEffect run2");
  }, []);

  return (
    // Under context provider, the "value" can be shared, accessed, and used directly by any child component under it WITHOUT NEEDING TO USE "PROPS" TO PASS DOWN
    // the "value" prop here must match with the type annotation we defined previously in context file (very important)
    <GlobalStateContext.Provider value={{ parentGlobalState, setParentGlobalState }}>
      <div>
        <h1>{title}</h1>
        <button onClick={setCounterHandler} style={{ marginRight: "10px" }}>
          add +
        </button>
        <span>count state: {counter}</span>

        <div style={{ display: "flex", marginTop: "50px" }}>
          {/* all child component will gain access to context value without using props at all WHEN THEY ARE WRAPPED UNDER TARGET CONTEXT PROVIDER COMPONENT*/}
          <Child1 {...c1Props} />
          {/* we can also wrap the functional component under js object and use in this way */}
          <Child2Object.Child2 />
        </div>
      </div>
    </GlobalStateContext.Provider>
  );
}

export default App;
