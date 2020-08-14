import { useState } from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace) => {
      setMode(mode)
      if(!replace) {
        setHistory(prev => ([...prev, mode]))
      }
   }

  const back = () => {
    if (history.length === 1) {
      return;
    }
    let whenPop = history.slice(0, history.length - 1)
    setHistory([ ...whenPop])
    setMode(history[whenPop.length - 1])
  }

  return {
    mode,
    transition,
    back
  }
}

