import { EnqueuedTask } from 'meilisearch';
import { MantineColor } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';

export const getTaskSubmitMessage = (task: EnqueuedTask): string => {
  return `Status ${task.status}, task uid ${task.taskUid} 🚀`;
};

const enum TaskStatus {
  TASK_SUCCEEDED = 'succeeded',
  TASK_PROCESSING = 'processing',
  TASK_FAILED = 'failed',
  TASK_ENQUEUED = 'enqueued',
}

export const TaskColors: Record<TaskStatus, MantineColor> = {
  [TaskStatus.TASK_SUCCEEDED]: 'success',
  [TaskStatus.TASK_ENQUEUED]: 'info',
  [TaskStatus.TASK_FAILED]: 'warning',
  [TaskStatus.TASK_PROCESSING]: 'grape',
};

export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
  showNotification({
    color: TaskColors[task.status],
    title: `Task ${task.status}`,
    message: getTaskSubmitMessage(task),
  });
};

export const getTimeText = (date: dayjs.ConfigType, defaultText?: string): string => {
  if (!date && defaultText) {
    return defaultText;
  }
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS');
};

export const stringifyJsonPretty = (json?: string | object) => {
  return JSON.stringify(json, undefined, 2);
};
