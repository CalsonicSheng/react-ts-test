import React, { ReactElement, useEffect, useState } from "react";
import Child1 from "./components/Child1";
import Child2Object from "./components/Child2";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { useCounterHook } from "./hooks/useCounterHook";

/*

- in client side, each page is built and rendered based on corresponding page-level functional component at client side with matching route when user navigate to that page

- there are also other re-useable or children components that can be used in the page-level functional components

- the navigation in these framework is conducted entirely on client-side, the previous page-level functional component will be unmounted and the new page-level functional component 
will be mounted through component js code rendering in react time (therefore, there is no html page / resource fetching upon navigation).

- "onMount" is also a "re-rendering" process

  - when onMount, the corresponding FE functional component will run all its js codes as FIRST TIME in its lifecycle on the client-side. 

  - all the process here is handled entirely by FE js code that updates DOM element accordingly (through react rendering process) for new page component 
  
  - if page requesting any additional data, is also handled by FE js code through AJAX (very important)
    
    - in previously traditional nav, browser will make a request to server to fetch the whole new html file, and then replace the whole page in the browser, results in a full page 
    reload (very important)

    - ajax typically used to fetch data in the form of JSON, XML, or other text-based format that can be processed by JS code and eventually affect DOM. This is because the primary purpose 
    of AJAX is to update PARTS of a web page without requiring a full page reload (this is why it is not used for fetch whole new html file).

    - comparing to traditional fetching which involve the browser making a request through browser search bar (GET request), HTML forms (GET or POST) or links (<a> tags)) to fetch the entire 
    page (html file) from the server. This will later replace the entire page in the browser, results in a full page reload (very important)

    - ajax is also conducted asynchrously, this means rest of the js code will not be blocked by the ajax request, and will continue to run while waiting for the ajax response (very important)

- rendering / re-rendering overall detail:

  - full re-rendering process involve following 4 steps when a state update function/navigation/component switching is conducted:

    1. recall/re-execute target componment function body: React will call the component function again the entire function is called again to generate the new JSX with new state values.
    (you have to realize that each functional component essentially returns a JSX code with state value in it)

    2. Create a New Virtual DOM Tree: React will create a new virtual DOM tree based on latest comopnent jsx code with updated state values

    3. Diffing/reconciliation: React will compare this new virtual DOM tree with NEW STATE VALUES to previous one's with current state values to find the differences (or "diffs").

    4. Update the Real DOM: React will update the real DOM to match the new virtual DOM, but only the parts that have changed.

      - only this step will trigger the real DOM update as the result of re-rendering process

      - However, this step will not be triggered if the new virtual DOM is the same as the previous one as no diffs found (if state update function does not change the state value)
      
  - Even if state update function is called and gives the SAME new state value, step 1-3 will still be conducted for the process, but step 4 will not be executed as no diffs 
  found (no real DOM update)

  - re-rendering can be triggered by:

    - component switching

    - component navigation

    - state update function call (major)

  - Component lifecycle types:

    - onMounting: When a component is FIRST created and added to the DOM (navigation / component switching)

    - Regular re-rendering: When a component is updated with new state data

    - Unmounting: When a component is removed from the DOM (navigation / component switching)
    
    react lifecycle hooks will recognize and differentiate these types 

*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// outside functional component code will only run once ONLY UPON COMPONENT MOUNTING and does not subject to react re-rendering process to re-execute these codes
// by convention, we must have modifiers ("const" or "let") for each declared variable (if not, then it will be treated as global variable under "window" object no matter where it is declared)
const title: string = "Parent Component";
const c1Props: { a: number; b: number } = { a: 5555, b: 6666 };
console.log("parent outside runs");

// ---------------------------------------------------------------------------------------------------------------------

function App(): ReactElement {
  // any declared state will be persistent and tracked for the lifespan of that component across multiple re-renders until the component is unmounted (very important)
  // by default, the state declared in a React component is local and private to that component. Other components cannot directly access or modify this state.
  // but state can be shared through props / context | as we learned, state sharing is always DOWNWARDS (not upwards) to child components as props (very important)
  // "the concept of lifting state up" is to pass setState function DOWN to child component as props, so that child component can update the state of parent component using its own state by calling it
  // the re-rendering process only takes place on the target component where target the state is originally declared and is triggered by update, and any child components under it (very important)
  // child component will always re-render when parent component re-render (no matter state is passed down or not), but parent component will not re-render when child component re-render
  // any state update function should only be called (after declaration) under either event handler or lifecycle hook. CAN NOT call directly under component function body to avoid infinite re-render.
  const [parentGlobalState, setParentGlobalState] = useState<number>(11111);
  const { counter, setCounterHandler }: { counter: number; setCounterHandler: () => void } = useCounterHook("parent");

  const [state1, setState1] = useState<number>(333);
  const [state2, setState2] = useState<number>(666);

  // Under the same function, if state update function is called and its state is also accessed AT THE SAME TIME IN A BATCH, then access of state will always be the OLD previous state value before the call (very important)
  // note, its always recommended to use functional callback form to update state if update depends on previous state value (very important)
  // only the functional callback parameter will always be the latest state value (very important)
  // the state value outside the function will be updated immediately and corresponding after batching however
  function batchUpdateHandler(): void {
    console.log("batch update handler run");

    // update state1 state for first time
    setState1((pre: number): number => {
      // pre = 333
      console.log("pre1", pre);
      return pre + 1;
    });

    // access state1, stay as 333 (the old value before the call) under the function body
    console.log("state1-1", state1);

    // update state1 state again, but this time, the pre value will be the latest state value (334)
    setState1((pre: number) => {
      // pre = 334
      console.log("pre2", pre);
      return pre + 1;
    });

    // still  stay as 333 (the old value before the call) under the function body
    console.log("state1-2", state1);
  }

  // we have tested that all useEffect hooks' callback functions will ONLY RUN AFTER ALL elements + children components are fully rendered under COMPONENT WHERE THEY DECLARED
  // if there are two or more "useEffect" hooks, then all of their callback functions will run IN THE ORDER when they declared (no suprise here)
  useEffect(() => {
    console.log("parent useEffect run1");
  }, []);

  useEffect(() => {
    console.log("parent useEffect run2");
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    // Under context provider, the "value" can be shared, accessed, and used directly by any child component under it WITHOUT NEEDING TO USE "PROPS" TO PASS DOWN
    // the "value" prop here must match with the type annotation we defined previously in context file (very important)
    <GlobalStateContext.Provider value={{ parentGlobalState, setParentGlobalState }}>
      <div>
        {/* {} are used to call js expression directly into jsx code | the expression return value will auto display on screen from jsx code */}
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
          {/* when we call react functional component, we have to use <> syntax, but not () | param/prop assignment is "identify = value" pattern + without comma */}
          {/* all the param/prop assignment will all be condensed into a single object */}
          {/* all child component will auto gain access to context value without using props at all WHEN THEY ARE WRAPPED UNDER TARGET CONTEXT PROVIDER COMPONENT */}
          {/* as tested, besides any string, any other data type when assign to prop MUST WRAP UNDER {} */}
          {/* for children props (special reserved props name), we can directly pass value in-between tags (again, for any value other than string, we have use {}) */}
          <Child1 c='dsd' {...c1Props} d={3}>
            <h2>this is children lol</h2>
          </Child1>
          {/* we can also wrap the functional component under js object and use in this way */}
          <Child2Object.Child2 />
        </div>
      </div>
    </GlobalStateContext.Provider>
  );
}

export default App;
