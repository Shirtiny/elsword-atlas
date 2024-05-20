import { memo, useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import StatusRow from "../../components/StatusRow";

import Icon from "../../components/Icon";
import {
  ACE_SKILL_KEY,
  FEATURES,
  KEYS,
  SPECIAL_SKILL_KEYS,
  TITLE_KEYS,
} from "../../config/constant";

import "./index.scss";
import useTimer from "../../hooks/useTimer";
import { getStatus } from "../../config/status";

let initFlag = false;

//事件的消息体
interface Payload {
  message: string;
}

let step = 0;

function Panel() {
  const titleKeyRef = useRef("");

  const [state, setState] = useState({
    key: "",
  });

  const [count155, timer155] = useTimer({
    name: FEATURES.t155,
  });
  const [count175, timer175] = useTimer({
    name: FEATURES.t175,
    point: (sec) => sec >= 60,
  });
  const [count156, timer156] = useTimer({
    name: FEATURES.t156,
    point: (sec) => sec >= 25,
  });
  const [countAce, timerAce] = useTimer({
    name: FEATURES.fAce,
    point: (sec) => sec >= 30,
  });

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
      case KEYS.switch: {
        step = 1;
        break;
      }
      case KEYS.dir.up:
      case KEYS.dir.left:
      case KEYS.dir.down:
      case KEYS.dir.right: {
        if (step < 1) break;

        titleKeyRef.current = key;

        if (key === TITLE_KEYS.t155) {
          timer155.stop();
          timer155.start((sec) => {
            const leave =
              titleKeyRef.current !== TITLE_KEYS.t155 &&
              [10, 5, 2].includes(sec);

            if (sec >= 15 || leave) {
              timer155.stop();
            }
          });
        }

        step = 0;

        break;
      }
      case KEYS.awake: {
        if (step < 1 && titleKeyRef.current === TITLE_KEYS.t175) {
          timer175.startDebounced();
        }
        break;
      }
      case KEYS.skill.s1:
      case KEYS.skill.s2:
      case KEYS.skill.s3:
      case KEYS.skill.s4:
      case KEYS.skill.s5:
      case KEYS.skill.es1:
      case KEYS.skill.es2:
      case KEYS.skill.es3:
      case KEYS.skill.es4:
      case KEYS.skill.es5: {
        if (
          step < 1 &&
          titleKeyRef.current === TITLE_KEYS.t156 &&
          SPECIAL_SKILL_KEYS.includes(key)
        ) {
          timer156.start();
        } else if (key === ACE_SKILL_KEY) {
          timerAce.stop();
          timerAce.start();
        }

        break;
      }
      case "v": {
        break;
      }
      case KEYS.reset: {
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

  const status155 = getStatus(FEATURES.t155, count155);
  const status175 = getStatus(FEATURES.t175, count175);
  const status156 = getStatus(FEATURES.t156, count156);
  const statusAce = getStatus(FEATURES.fAce, countAce);

  const currentTitleKey = titleKeyRef.current;

  console.log("key", state.key);

  return (
    <div className="panel-page">
      <div className="main">
        <StatusRow
          selected={currentTitleKey === TITLE_KEYS.t155}
          title="155"
          iconSrc="/155.webp"
          text={status155.text}
          count={status155.count}
          active={status155.active}
        />
        <StatusRow
          selected={currentTitleKey === TITLE_KEYS.t175}
          title="175"
          iconSrc="/175.webp"
          text={status175.text}
          count={status175.count}
          active={status175.active}
        />
        <StatusRow
          selected={currentTitleKey === TITLE_KEYS.t156}
          title="百鬼"
          iconSrc="/156.webp"
          text={status156.text}
          count={status156.count}
        />
        <StatusRow title="Ace" text={statusAce.text} count={statusAce.count} />
      </div>
      <div className="side">
        <div className="brand">AT</div>
        {/* <div className="key">{state.key || "KEY"}</div> */}
        <Icon className="settings-icon" src="/icons/settings.svg" />
      </div>
    </div>
  );
}

export default memo(Panel);
