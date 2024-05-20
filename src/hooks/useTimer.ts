import { useCallback, useMemo, useState } from "react";
import Timer from "../timer";
import { debounce } from "lodash";

const timerMap: {
  [index: string]: Timer;
} = {};

interface ITimerCb {
  (sec: number): void;
}

interface ITimer {
  start: (cb?: ITimerCb) => void;
  startDebounced: (cb?: ITimerCb) => void;
  stop: () => void;
}

interface IUserTimerParams {
  name: string;
  point?: (sec: number) => boolean;
}

const useTimer = ({
  name,
  point,
}: IUserTimerParams): [number, ITimer] => {
  const [count, setCount] = useState(0);

  const timer = timerMap[name] || new Timer();
  timerMap[name] = timer;

  const stop = useCallback(() => {
    timer.stop();
    setCount(0);
  }, [timer]);

  const start = useCallback(
    (cb?: ITimerCb) => {
      timer.start((sec: number) => {
        setCount((v) => v + 1);
        cb && cb(sec);
        if (point && point(sec)) {
          stop();
        }
      });
    },
    [timer, stop]
  );

  const startDebounced = useMemo(
    () =>
      debounce((cb?: ITimerCb) => {
        start(cb);
      }, 200),
    [start]
  );

  return [count, { start, startDebounced, stop }];
};

export default useTimer;
