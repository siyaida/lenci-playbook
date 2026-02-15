import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500', className)}
      {...props}
    />
  );
}
