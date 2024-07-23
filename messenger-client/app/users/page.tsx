import React from 'react';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';

const UsersPage = () => {
  return (
    <div className='hidden lg:block lg:pl-80 h-full dark:bg-slate-800/50'>
      <EmptyState />
    </div>
  )
}

export default UsersPage;
