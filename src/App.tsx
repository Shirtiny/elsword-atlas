import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import "./App.css";
import StatusRow from "./StatusRow";
import Timer from "./timer";

let initFlag = false;

//事件的消息体
interface Payload {
  message: string;
}

const titleMap: Record<string, string> = {
  k: "155",
  a: "破灭",
  s: "175",
  d: "黑白",
};

const get155Status = (count: number) => {
  if (!count) return { active: false, text: "未激活", count: 0 };

  const v = count % 15;
  let name = "";
  if (v <= 2) name = "柔韧";
  if (v > 2 && v <= 5) name = "强韧";
  if (v > 5 && v <= 10) name = "强烈";
  if (v > 10 && v <= 15) name = "超越";

  return { active: name === "超越", text: `${name}+15%`, count: v };
};

const get175Status = (count: number) => {
  if (count > 0 && count <= 40) {
    return { active: true, text: "伤害+15%", count };
  }

  if (count > 40 && count <= 60) {
    return { active: false, text: "冷却中", count };
  }

  return { active: false, text: "未激活", count };
};

let step = 0;

const timer155 = new Timer();
const timer175 = new Timer();

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  const [state, setState] = useState({
    key: "",
  });
  const [count155, setCount155] = useState(0);
  const [count175, setCount175] = useState(0);
  const titleKeyRef = useRef("");

  const set = (obj: Object) => {
    setState((s) => ({ ...s, ...obj }));
  };

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const handleKeyUp = useCallback((key: string) => {
    set({ key });

    switch (key) {
      case "z": {
        step = 1;
        break;
      }
      case "k":
      case "a":
      case "s":
      case "d": {
        if (step < 1) break;

        titleKeyRef.current = key;

        if (key === "k") {
          timer155.start(() => {
            setCount155((v) => v + 1);
          });
        } else {
          timer155.stop();
          setCount155(0);
        }

        step = 0;

        break;
      }
      case "ctrlL": {
        if (step < 1 && titleKeyRef.current === "s") {
          timer175.startDebounced((sec: number) => {
            setCount175((v) => v + 1);
            if (sec >= 60) {
              timer175.stop();
              setCount175(0);
            }
          });
        }
        break;
      }

      default:
        break;
    }
  }, []);

  const init = () => {
    if (initFlag) return;
    invoke("capture");
    initFlag = true;
    listen<Payload>("keyup", (event) => {
      console.log(event);
      handleKeyUp(event.payload.message);
    });
  };

  useEffect(() => {
    init();
  }, []);

  const status155 = get155Status(count155);
  const status175 = get175Status(count175);

  const currentTitle = titleMap[titleKeyRef.current];

  return (
    <div className="app">
      <StatusRow
        title="155"
        text={status155.text}
        count={status155.count}
        active={status155.active}
      />
      <StatusRow
        title="175"
        text={status175.text}
        count={status175.count}
        active={status175.active}
      />
      <div className="footer">
        <div>{currentTitle}</div>
        <div className="space"></div>
        <div className="key">{state.key}</div>
      </div>
    </div>
  );
}

export default App;
