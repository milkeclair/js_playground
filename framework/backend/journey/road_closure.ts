const ONE_MINUTE = 60000;

export function RoadClosure() {
  let lastTime: number | null = null;

  return {
    isOpen: () => {
      if (!lastTime) {
        lastTime = Date.now();
        return true;
      } else {
        return lastTime + ONE_MINUTE < Date.now();
      }
    },

    close: () => {
      lastTime = Date.now();
    },
  };
}
