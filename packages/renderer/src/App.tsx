import { createSignal, onCleanup, Component } from "solid-js";

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);

  onCleanup(() => clearInterval(timer));
  return <div>{count()}</div>;
};

export default App;
