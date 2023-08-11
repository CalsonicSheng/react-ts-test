import React, { ReactElement, useEffect, useState } from "react";
import Child1 from "./components/Child1";
import Child2Object from "./components/Child2";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { useCounterHook } from "./hooks/useCounterHook";

/*

- in client side, its all about react (next.js also uses react purely in client), each page is built and rendered based on corresponding page-level functional component

- there are also other re-useable components that can be used in multiple different page-level functional components | altogether they form a different page

- the navigation in these framework is client-side default, the previous page-level functional component will be unmounted and the new page-level functional component will be mounted
the framework switches and re-renders the corresponding functional components on the client-side, without requiring a full-page reload (very important)

  - note mounting/unmounting is also a re-rendering process, so the component will run all the codes inside the component function body again (very important)

  - but react lifecycle hooks will recognize the mounting/unmounting/re-rendering process differently for you (very important)

  - Mounting: When a component is FIRST created and added to the DOM

  - Re-rendering: When a component is updated with new state data

  - Unmounting: When a component is removed from the DOM

- the data fetching in react framework is also client-side default (next.js gives more flexbility) and largely use AJAX

  - this means the ajax function is used under the component function body and is called only upon onmount or upon state change (this is why it is largely called under lifecycle hook) 
  or called only upon certain user interaction (this is to prevent infinite fetching loop if it is directly called under component function body)
  
  - AJAX is the standard default way to fetch data in react framework, this request/response process is handled entirely by js code and not by the browser itself (very important)

  - AJAX is primarily used for fetching specific data from the server, commonly in JSON format or other structured data formats (not file), to update specific parts of a web page dynamically, 
  without requiring a full page reload. However, any traditional fetching (HTML forms (GET or POST) or links (<a> tags)) is to fetch the entire page (html file) from the server and 
  replace the entire page in the browser with the new page that cause full page reload.

  - once these fetched json data are received, they are used to update the state of the component, which will trigger the react's optimized re-rendering process of the component (very important)

  - all these ajax is async function, which can be handled by either promise or async/await fashiion (very important) | as we have learned, once they are called, their underlying time-consuming 
  operation is automatically offloaded to async api to execute (which can execute multiple in parallel) WITHOUT BLOCKING REST OF THE CODE, and all their callback logics will also be AUTOMATICALLY 
  called AGAIN when time-consuming operation is completed by js main thread (very important)

*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// outside functional component code will only run once ONLY UPON COMPONENT MOUNTING and does not subject to react re-rendering process to re-execute these codes
// by convention, we must have modifiers ("const" or "let") for each declared variable (if not, then it will be treated as global variable under "window" object no matter where it is declared)
const title: string = "Parent Component";
const c1Props: { a: number; b: number } = { a: 5555, b: 6666 };
console.log("parent outside runs");

// ---------------------------------------------------------------------------------------------------------------------

function App(): ReactElement {
  console.log("parent component run");

  // by default, the state declared in a React component is local and private to that component. Other components cannot directly access or modify this state.
  // but state can be passed down to child components as props, which can be used in the child component afterwards (very important)
  // the state update function "setState" is also passed down to child components as props, which can be used to update the state of the parent component (very important)
  // the re-rendering process only takes place on the component where the state is originally declared, and any child components under it (very important)
  // any state update function should only be called (after declaration) under either event handler or lifecycle hook. CAN NOT call direcly under component function body to avoid infinite loop.
  // we can also see if the state update results the same previous state value, then the component will NOT re-render.
  const [parentGlobalState, setParentGlobalState] = useState<number>(11111);
  const { counter, setCounterHandler }: { counter: number; setCounterHandler: () => void } = useCounterHook("parent");

  // batch state updates
  // we can see react will batch all the state updates when they are grouped under the single event handler function call "batchUpdateHandler"
  // state2 update uses state1 value, but this state1 value is not the latest state1 value AFTER UPDATE, but is the value BEFORE event handler function is called (very important)
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
