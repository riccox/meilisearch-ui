import { EnqueuedTask } from 'meilisearch';
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

const TaskStatusToast: Record<
  TaskStatus,
  (typeof toast)['success'] | (typeof toast)['info'] | (typeof toast)['error']
> = {
  [TaskStatus.TASK_SUCCEEDED]: toast.success,
  [TaskStatus.TASK_ENQUEUED]: toast.info,
  [TaskStatus.TASK_FAILED]: toast.error,
  [TaskStatus.TASK_PROCESSING]: toast.info,
};
export const TaskThemes: Record<TaskStatus, string> = {
  [TaskStatus.TASK_SUCCEEDED]: 'success',
  [TaskStatus.TASK_ENQUEUED]: 'warn',
  [TaskStatus.TASK_FAILED]: 'danger',
  [TaskStatus.TASK_PROCESSING]: 'secondary',
};

export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
  TaskStatusToast[task.status](getTaskSubmitMessage(task));
};

export const showTaskErrorNotification = (err: any): void => {
  TaskStatusToast.failed(`Task Fail: ${err.toString()}`);
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
