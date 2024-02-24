import { debounce } from "lodash";

class Timer {
  id = 0;
  sec = 0;
  running = false;

  stop = () => {
    clearInterval(this.id);
    this.id = 0;
    this.sec = 0;
    this.running = false;
  };

  start = (cb: any) => {
    if (this.running) return;
    this.id = setInterval(() => {
      this.sec += 1;
      cb?.(this.sec);
    }, 1000);
    this.running = true;
  };

  startDebounced = debounce((cb: any) => {
    this.start(cb);
  }, 200);
}

export default Timer;
