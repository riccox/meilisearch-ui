import { EnqueuedTask } from 'meilisearch';
import { TypeOptions } from 'react-toastify';
import dayjs from 'dayjs';
import { toast } from './toast';

export const getTaskSubmitMessage = (task: EnqueuedTask): string => {
  return `Task submit ${task.status}, task uid ${task.taskUid} 🚀`;
};

const enum TaskStatus {
  TASK_SUCCEEDED = 'succeeded',
  TASK_PROCESSING = 'processing',
  TASK_FAILED = 'failed',
  TASK_ENQUEUED = 'enqueued',
}

const TaskColors: Record<TaskStatus, TypeOptions> = {
  [TaskStatus.TASK_SUCCEEDED]: 'success',
  [TaskStatus.TASK_ENQUEUED]: 'info',
  [TaskStatus.TASK_FAILED]: 'warning',
  [TaskStatus.TASK_PROCESSING]: 'default',
};
export const TaskThemes: Record<TaskStatus, string> = {
  [TaskStatus.TASK_SUCCEEDED]: 'success',
  [TaskStatus.TASK_ENQUEUED]: 'warn',
  [TaskStatus.TASK_FAILED]: 'danger',
  [TaskStatus.TASK_PROCESSING]: 'secondary',
};

export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
  toast(getTaskSubmitMessage(task), {
    type: TaskColors[task.status],
  });
};

export const showTaskErrorNotification = (err: any): void => {
  toast(`Task Fail: ${err.toString()}`, {
    type: TaskColors.failed,
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
