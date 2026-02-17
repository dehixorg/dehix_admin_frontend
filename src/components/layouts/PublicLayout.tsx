'use client';

import React from 'react';

type Props = {
  containerClassName?: string;
  mainClassName?: string;
  children: React.ReactNode;
};

export default function PublicLayout({
  containerClassName,
  mainClassName,
  children,
}: Props) {
  return (
    <div className={containerClassName ?? 'min-h-screen w-full'}>
      <main className={mainClassName ?? ''}>{children}</main>
    </div>
  );
}
