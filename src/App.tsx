import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import StatusRow from "./components/StatusRow";
import Settings from "./components/Settings";
import Timer from "./timer";

import "./App.scss";

let initFlag = false;

//事件的消息体
interface Payload {
  message: string;
}

enum titleKeys {
  t155 = "k",
  t156 = "a",
  t175 = "s",
}

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

const get156Status = (count: number) => {
  if (count > 0 && count <= 25) {
    return { active: false, text: "冷却中", count };
  }

  return { active: false, text: "可用", count };
};

const getELGStatus = (count: number) => {
  if (count > 0 && count <= 30) {
    return { active: false, text: "冷却中", count };
  }

  return { active: false, text: "可用", count };
};

let step = 0;

const timer155 = new Timer();
const timer175 = new Timer();
const timer156 = new Timer();
const timerELG = new Timer();

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  const [state, setState] = useState({
    key: "",
  });
  const [count155, setCount155] = useState(0);
  const [count175, setCount175] = useState(0);
  const [count156, setCount156] = useState(0);
  const [countELG, setCountELG] = useState(0);
  const titleKeyRef = useRef("");

  const set = (obj: Object) => {
    setState((s) => ({ ...s, ...obj }));
  };

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const handleKeyUp = useCallback((key: string) => {
    key !== "unknown" && set({ key });

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

        if (key === titleKeys.t155) {
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
        if (step < 1 && titleKeyRef.current === titleKeys.t175) {
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
      case "q":
      case "w":
      case "e":
      case "r":
      case "f":
      case "x":
      case "c":
      case "h":
      case "i":
      case "o": {
        const special = ["q", "e", "x", "c", "h", "i", "o"];
        if (
          step < 1 &&
          titleKeyRef.current === titleKeys.t156 &&
          special.includes(key)
        ) {
          timer156.start((sec: number) => {
            setCount156((v) => v + 1);
            if (sec >= 25) {
              timer156.stop();
              setCount156(0);
            }
          });
        }
        timerELG.start((sec: number) => {
          setCountELG((v) => v + 1);
          if (sec >= 30) {
            timerELG.stop();
            setCountELG(0);
          }
        });
        break;
      }
      case "v": {
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
    listen<Payload>("keyup", (event: any) => {
      console.log(event);
      handleKeyUp(event.payload.message);
    });
  };

  useEffect(() => {
    init();
  }, []);

  const status155 = get155Status(count155);
  const status175 = get175Status(count175);
  const status156 = get156Status(count156);
  const statusELG = getELGStatus(countELG);

  const currentTitleKey = titleKeyRef.current;

  console.log("key", state.key);

  return (
    <div className="app">
      <div className="main">
        <StatusRow
          selected={currentTitleKey === titleKeys.t155}
          title="155"
          iconSrc="/155.webp"
          text={status155.text}
          count={status155.count}
          active={status155.active}
        />
        <StatusRow
          selected={currentTitleKey === titleKeys.t175}
          title="175"
          iconSrc="/175.webp"
          text={status175.text}
          count={status175.count}
          active={status175.active}
        />
        <StatusRow
          selected={currentTitleKey === titleKeys.t156}
          title="百鬼"
          iconSrc="/156.webp"
          text={status156.text}
          count={status156.count}
        />
        <StatusRow
          title="埃力格"
          text={statusELG.text}
          count={statusELG.count}
        />
      </div>
      <div className="side">
        <div className="key">{state.key || "KEY"}</div>
        <Settings />
      </div>
    </div>
  );
}

export default App;
