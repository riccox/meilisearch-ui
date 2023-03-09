import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { IconPlus, IconCircleMinus, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { PropsWithoutRef, useCallback, useMemo, useState } from 'react';
import { openConfirmModal } from '@mantine/modals';
import _ from 'lodash';
import { arrayMove } from '@/src/utils/array';

export function ArrayInput<V extends string>({
  defaultValue,
  onMutation,
  className,
  moveable = false,
}: PropsWithoutRef<{
  className?: string;
  defaultValue: V[];
  onMutation: (value: V[]) => void;
  moveable?: boolean;
}>) {
  const [array, setArray] = useState<V[]>(defaultValue);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addForm = useForm({ defaultValues: { input: '' } });

  const onCompleteInput = useCallback(() => {
    console.debug('🚀 ~ file: ArrayInput onCompleteInput');
    // close input
    setIsAdding(false);
    addForm.reset();
  }, [addForm]);

  const onSubmit = addForm.handleSubmit(async ({ input }) => {
    console.debug('🚀 ~ file: ArrayInput onSubmit', input);
    const updated = array.concat(input as V);
    setArray(updated);
    onMutation(updated);
    onCompleteInput();
  });

  const onClickItemUp = useCallback(
    (index: number) => {
      console.debug('🚀 ~ file: ArrayInput onClickItemUp', index);
      if (!moveable || index <= 0) return;

      const updated = arrayMove(array, index, index - 1);
      setArray(updated);
      onMutation(updated);
    },
    [array, moveable, onMutation]
  );

  const onClickItemDown = useCallback(
    (index: number) => {
      console.debug('🚀 ~ file: ArrayInput onClickItemDown', index);
      if (!moveable || index >= array.length - 1) return;

      const updated = arrayMove(array, index, index + 1);
      setArray(updated);
      onMutation(updated);
    },
    [array, moveable, onMutation]
  );

  const onClickItemDel = useCallback(
    (index: number) => {
      console.debug('🚀 ~ file: ArrayInput onClickItemDel', index);

      openConfirmModal({
        title: 'Remove this item',
        centered: true,
        children: <p>Are you sure you want to remove "{array[index]}" ?</p>,
        labels: { confirm: 'Remove', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          const updated = _.without(array, array[index]);
          setArray(updated);
          onMutation(updated);
        },
      });
    },
    [array, onMutation]
  );

  return useMemo(
    () => (
      <div className={clsx(className, 'flex flex-col gap-2')}>
        {(isAdding ? array : defaultValue).map((item, i) => (
          <div
            key={i}
            className="w-full flex justify-center items-center p-2 bg-primary-200 text-primary-1000 rounded-xl"
          >
            <p className="flex-1 text-center">{item}</p>
            <button className={clsx((!moveable || i <= 0) && 'hidden', 'ml-auto')} onClick={() => onClickItemUp(i)}>
              <IconArrowUp />
            </button>
            <button
              className={clsx((!moveable || i >= array.length - 1) && 'hidden')}
              onClick={() => onClickItemDown(i)}
            >
              <IconArrowDown />
            </button>
            <button onClick={() => onClickItemDel(i)}>
              <IconCircleMinus />
            </button>
          </div>
        ))}
        <form className={clsx(!isAdding && 'hidden', 'flex gap-2 items-center')}>
          <input className="input outline primary" {...addForm.register('input', { required: true })} />
          <button
            className="btn outline sm success"
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            Save
          </button>
          <button
            className="btn outline sm bw"
            onClick={(e) => {
              e.preventDefault();
              onCompleteInput();
            }}
          >
            Cancel
          </button>
        </form>
        <button className={clsx(isAdding && 'hidden', 'btn primary outline w-full')} onClick={() => setIsAdding(true)}>
          <IconPlus />
        </button>
      </div>
    ),
    [
      addForm,
      array,
      className,
      defaultValue,
      isAdding,
      moveable,
      onClickItemDel,
      onClickItemDown,
      onClickItemUp,
      onCompleteInput,
      onSubmit,
    ]
  );
}
