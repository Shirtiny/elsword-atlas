import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

let initFlag = false;

//事件的消息体
interface Payload {
  message: string;
}

const getDesc = (count: number) => {
  const v = count % 15;
  if (v <= 2) return "柔韧";
  if (v <= 5) return "强韧";
  if (v <= 10) return "强烈";
  if (v <= 15) return "超越";
};

let id = 0;
let step = 0;

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  const [state, setState] = useState({
    key: "",
  });
  const [count, setCount] = useState(0);

  const set = (obj: Object) => {
    setState((s) => ({ ...s, ...obj }));
  };

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const start = () => {
    id = setInterval(() => {
      setCount((v) => v + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(id);
    setCount(0);
  };

  const handleKeyUp = (key: string) => {
    set({ key });

    switch (key) {
      case "z": {
        step = 1;
        break;
      }
      case "k": {
        !id && step === 1 && start();
        step = 0;
        break;
      }
      case "a":
      case "s":
      case "d": {
        step === 1 && stop();
        step = 0;
        break;
      }

      default:
        break;
    }
  };

  const init = () => {
    if (initFlag) return;
    invoke("capture");
    listen<Payload>("keyup", (event) => {
      console.log(event);
      handleKeyUp(event.payload.message);
    });
    initFlag = true;
  };

  useEffect(() => {
    init();
  }, []);

  const desc = getDesc(count);
  console.log("desc", desc);

  const isP3 = desc === "超越";

  return (
    <div className="app">
      <div className="key">{state.key}</div>
      <div className="space"></div>
      <div
        className="desc"
        style={
          isP3
            ? {
                color: "red",
                fontWeight: "bold",
              }
            : {}
        }
      >
        {desc}
      </div>
      <div className="space"></div>
      <div className="count">{count % 15}</div>
    </div>
  );
}

export default App;
