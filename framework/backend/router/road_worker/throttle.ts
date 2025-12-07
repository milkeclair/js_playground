const ONE_MINUTE = 60000;

export function Throttle() {
  let lastTime: number | null = null;

  return {
    isReady: () => {
      if (!lastTime) {
        lastTime = Date.now();
        return true;
      } else {
        return lastTime + ONE_MINUTE < Date.now();
      }
    },

    update: () => {
      lastTime = Date.now();
    },
  };
}
