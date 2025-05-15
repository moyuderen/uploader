import { HttpStatus, HttpException } from '@nestjs/common';

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

export const interceptRequest = () => {
  if (process.env.CONTAINER === 'vercel') {
    throw new HttpException(
      'Please use https://uploader-server-seven.vercel.app/file !',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
