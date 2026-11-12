const ONE_MINUTE = 60000;

export function RefreshThrottle() {
  let lastTime: number | null = null;

  return {
    shouldRefresh: () => {
      if (!lastTime) {
        lastTime = Date.now();
        return true;
      } else {
        return lastTime + ONE_MINUTE < Date.now();
      }
    },

    markRefreshed: () => {
      lastTime = Date.now();
    },
  };
}
