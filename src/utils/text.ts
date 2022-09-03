import { EnqueuedTask } from 'meilisearch';
import { MantineColor } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

export const getTaskSubmitMessage = (task: EnqueuedTask): string => {
  return `Status ${task.status}, task uid ${task.taskUid} 🚀`;
};

const enum TaskStatus {
  TASK_SUCCEEDED = 'succeeded',
  TASK_PROCESSING = 'processing',
  TASK_FAILED = 'failed',
  TASK_ENQUEUED = 'enqueued',
}

const TaskColors: Record<TaskStatus, MantineColor> = {
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
