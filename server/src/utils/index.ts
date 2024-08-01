export const sleep = (time = 2000, isReject = false) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearInterval(timer);
      if (isReject) {
        reject(false);
      }
      resolve(true);
    }, time);
  });
};
