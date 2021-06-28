import { notification } from 'antd';

export const info = (content : string) => {
  notification.info({
    message: 'Info',
    description: content,
    duration: 1.6,
  });
};

export const err = (content : string) => {
  notification.error({
    message: 'Error',
    description: content,
    duration: 3,
  });
};
