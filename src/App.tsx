import React, { ReactElement, useEffect, useState } from "react";
import Child1 from "./components/Child1";
import Child2Object from "./components/Child2";
import { GlobalStateContext } from "./context/GlobalStateContext";
import { useCounterHook } from "./hooks/useCounterHook";

/*

- react framework is composed of a bunch of react functional components, each functional component is a function that returns a JSX code set (very important)

  - functional components can also accept props (as parameters) and use hooks for managing state and side effects.

  - the call of such function component + props format must be in the form of <ComponentName propName1={propValue1} propName2={propValue2} ... />
  
  - these props name and value will be condensed into a single JS object and passed into the function component as the first parameter (very important)

- on the client side, each page is built based on corresponding page-level react functional component jsx code call when matching with navigation.

  - each page-level function component is rendered correspondingly based on matching route/navigation in the client side

- there are also other re-useable or children components that can be used in the page-level functional components

  - promote modularity and code reuse.

- Navigation is handled entirely on client side in modern frameworks, and each page-level components correspond to render (onMount / unMount) based on different routes navigated to.

- "onMount" process

  - The component onMount (page-level or reuseable) happens when a component is "FIRST-TIME" added to the DOM 
  
  - "onMount" event MARKS THE BEGINNING OF EACH LIFE CYCLE OF THAT COMPONENT (VERY IMPORTANT)
  
  - this is time where state value is initialized to initial value (very important) and start getting tracked till component unMounting
    
  - if page requesting any additional data & fetching, this is also handled by FE js code through AJAX (very important)
    
    - in previously traditional nav, browser will make a request to server to fetch the whole new html file, and then replace the whole page in the browser, results in a full page 
    reload (very important)

    - ajax typically used to fetch data in the form of JSON, XML, or other text-based format that can be processed by JS code and eventually affect DOM. This is because the primary purpose 
    of AJAX is to update PARTS of a web page without requiring a full page reload (this is why it is not used for fetch whole new html file).

    - comparing to traditional fetching which involve the browser making a request through browser search bar (GET request), HTML forms (GET or POST) or links (<a> tags)) to fetch the entire 
    page (html file) from the server. This will later replace the entire page in the browser, results in a full page reload (very important)

    - ajax is also conducted asynchrously, this means rest of the js code will not be blocked by the ajax request, and will continue to run while waiting for the ajax response (very important)

- re-rendering process and steps:

  1. recall/re-execute target componment function body: React will call the component function again the entire function is called again to generate the new JSX with new state values.
  (you have to realize that each functional component essentially returns a JSX code with state/variable/static value in it)

  2. Create a New Virtual DOM Tree: React will create a new virtual DOM tree based on latest comopnent jsx code with updated state values

  3. Diffing/reconciliation: React will compare this new virtual DOM tree with NEW STATE VALUES to previous one's with current state values to FIND ANY DIFFERENCES (or "diffs").

  4. Update the Real DOM: React will update the real DOM to match the new virtual DOM (only if diffs are found) 
  
    - only update the parts that have changed 
    
    - reconciliation algorithm optimizes this process, minimizing the updates to the real DOM (very important).
      
  - Even if state update function is called and gives the SAME new state value, step 1-3 will still be conducted for the process, but step 4 will not be executed as no diffs 
   found (no real DOM update)

- functional component normal re-rendering (exclude on/unMount) can be triggered by:

  1. state update function call (which leads to new state value and generate new jsx code set)

  2. props + context value change
  
    - these are the values passed + consumed from a parent component to a child component.
    
    - by default react behavior, if parent component re-render, then all its child component will also re-render no matter what (very important)

- Component lifecycle types:

  1. onMounting: When a component is FIRST created and added to the DOM (navigation / component switching)

  2. Regular re-rendering: When a component is updated with new state data

  3. unMounting: When a component is removed from the DOM (navigation / component switching)
  
  react lifecycle useEffect hooks will recognize and differentiate these types (very powerful) 

- useEffect hook

  - its callback function will run after the first render (onMount) and after every update (re-render) by default.

  - However, its behavior can be controlled by its dependency array (very important):

    1. Empty Dependency Array: If you pass an empty array ([]) as the second argument to useEffect, the callback will only run after the initial render.

    2. No Dependency Array: If you omit the dependency array, the callback runs onMount + after every re-render.

    3. With Dependencies: If you pass a list of dependencies, useEffect will only re-run when one of those dependencies has changed.


*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// each functional component is a function that needs to run first -> execute all its codes under its block and returns JSX code set -> this jsx code set is what all rendered element on screen
// re-render means the component function will be called again to generate a new JSX code set with new state values, and then update the real DOM to match the new virtual DOM
// outside functional component code will only run once ONLY UPON COMPONENT MOUNTING and does not subject to react re-rendering process to re-execute these codes
// by convention, we must have modifiers ("const" or "let") for each declared variable (if not, then it will be treated as global variable under "window" object no matter where it is declared)
const title: string = "Parent Component";
const c1Props: { a: number; b: number } = { a: 5555, b: 6666 };
console.log("parent outside runs");

// ---------------------------------------------------------------------------------------------------------------------

function App(): ReactElement {
  // any declared states will be persistent and tracked for the lifespan of that component since onMount across multiple re-renders until the component is unmounted (very important)
  // by default, the state declared in a React component is local and private to that component. Other components cannot directly access or modify this state.
  // but state can be shared through props / context | as we learned, state sharing is always DOWNWARDS (not upwards) to child components as props (very important)
  // "the concept of lifting state up" is to pass setState function DOWN to child component as props, so that child component can update the state of parent component using its own state by calling it
  // The re-rendering is triggered only in the component where its state, initially set within that component, is being updated through the state update function (very important)
  // child component will always re-render when parent component re-render (no matter state is passed down or not), but parent component will not re-render when child component re-render
  // any state update function should only be called under either event handler or lifecycle hook. CAN NOT call directly under component function body to avoid infinite re-render.
  const [parentGlobalState, setParentGlobalState] = useState<number>(11111);
  const { counter, setCounterHandler }: { counter: number; setCounterHandler: () => void } = useCounterHook("parent");

  const [state1, setState1] = useState<number>(333);
  const [state2, setState2] = useState<number>(666);

  // When a state update function is called and the state is accessed simultaneously within the same function, the accessed state will always be previous value throughout the function body.
  // note, its always recommended to use functional callback to update state if update depends on previous state value (very important)
  // only the functional callback parameter will always be the latest state value even under the same function call (very important)
  // the state value outside the function will be updated immediately and corresponding after batching however
  function batchUpdateHandler(): void {
    console.log("batch update handler run");

    // update state1 state for first time
    setState1((pre: number): number => {
      // pre = 333
      console.log("pre1", pre);
      return pre + 1;
    });

    // access state1, stay as 333 (the old value before calling this function) under the function body
    console.log("state1-1", state1);

    // update state1 state again, but this time, the pre value will be the latest state value (334)
    setState1((pre: number) => {
      // pre = 334
      console.log("pre2", pre);
      return pre + 1;
    });

    // still  stay as 333 (the old value before calling this function) under the function body
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
    // Under context provider, the "value" can be shared, accessed, and used directly by any child component under it WITHOUT NEEDING TO USE "PROPS" TO PASS DOWN through each vertical level
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
          {/* when we call react functional component, we have to use <> syntax, but not () | param/prop assignment is "key = {value}" pattern + without comma */}
          {/* as tested, besides any string, any other data type when assign to prop MUST WRAP UNDER {} */}
          {/* all the param/prop assignment following this pattern will condense into a single object (very important) */}
          {/* all child component will auto gain access to context value without using props at all WHEN THEY ARE WRAPPED UNDER TARGET CONTEXT PROVIDER COMPONENT */}
          {/* for "children" props (special reserved props name), we can directly pass value in-between tags (again, for any value other than string, we have use {}) */}
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
