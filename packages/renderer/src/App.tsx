import { createSignal, onCleanup, Component } from "solid-js";
import "./index.css";

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);

  onCleanup(() => clearInterval(timer));
  return <div class="h-full bg-blue-300">{count()}</div>;
};

export default App;
