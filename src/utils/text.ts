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
  [TaskStatus.TASK_SUCCEEDED]: 'green',
  [TaskStatus.TASK_ENQUEUED]: 'blue',
  [TaskStatus.TASK_FAILED]: 'yellow',
  [TaskStatus.TASK_PROCESSING]: 'grape',
};

export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
  showNotification({
    color: TaskColors[task.status],
    title: `Task ${task.status}`,
    message: getTaskSubmitMessage(task),
  });
};

export const showTaskErrorNotification = (err: any): void => {
  showNotification({
    color: TaskColors.failed,
    title: `Task Fail`,
    message: err.toString(),
  });
};

export const getTimeText = (
  date: dayjs.ConfigType,
  {
    defaultText = '-',
    format = 'YYYY-MM-DD HH:mm:ss.SSS',
  }: {
    format?: string;
    defaultText?: string;
  } = {}
): string => {
  if (!date && defaultText) {
    return defaultText;
  }
  return dayjs(date).format(format);
};

export const stringifyJsonPretty = (json?: string | object | null) => {
  return JSON.stringify(json, undefined, 2);
};
