import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn('flex h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-accent-850 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-accent-850', className)} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };