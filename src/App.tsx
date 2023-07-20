import React, { ReactElement, useEffect, useState } from "react";
import Child1 from "./components/Child1";
// import Child2 from './components/Child2';
import Child2Object from "./components/Child2";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { useCounterHook } from "./hooks/useCounterHook";

// outside functional component code will only run once ONLY UPON COMPONENT MOUNTING and does not subject to react re-rendering process to re-execute these codes
// by convention, we must have modifiers ("const" or "let") for each declared variable (if not, then it will be treated as global variable under "window" object)
const title: string = "Parent Component";
const c1Props: { a: number; b: number } = { a: 5555, b: 6666 };
console.log("parent outside runs");

// ---------------------------------------------------------------------------------------------------------------------

function App(): ReactElement {
  console.log("parent component run");

  // again, all the "states" when declared are only locally accessible in the TARGET component where they declared and ARE NOT shareable/accessible by other child components.
  // any state update function should only be called (after declaration) under either event handler or lifecycle hook. CAN NOT call direcly under component function body to avoid infinite loop.
  // we can also see if the state update results the same previous state value, then the component will NOT re-render.
  const [parentGlobalState, setParentGlobalState] = useState<number>(11111);
  const { counter, setCounterHandler }: { counter: number; setCounterHandler: () => void } = useCounterHook("parent");

  // batch state updates
  // we can see react will batch all the state updates when they are grouped under the single event handler function call
  // state2 update uses state1 value, but this state1 value is not the latest state1 value, but the state1 value when the event handler function is called (very important)
  // this meanings the batch update uses the latest state value BEFORE the event handler function is called, but not the latest state value AFTER the state update function is called
  // if state2 update needs to use the latest state1 value, then we need to use "useEffect" hook to run the state2 update function AFTER the state1 update function is completed
  // this is the STATE UPDATE ORDERING, we can use "useEffect" hook to solve this problem (very important)
  const [state1, setState1] = useState<number>(333);
  const [state2, setState2] = useState<number>(666);

  function batchUpdateHandler(): void {
    setState1(state1 + 1);
    setState2(state1 * 100);
  }

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
        <span>count couner state: {counter}</span>
        <div />
        <button onClick={batchUpdateHandler} style={{ marginRight: "10px" }}>
          batch update
        </button>
        <p>state1: {state1}</p>
        <p>state2: {state2}</p>

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
