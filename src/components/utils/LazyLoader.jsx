import { Suspense } from 'react';
import { Spinner } from './Spinner';

export const LazyLoader = ({ children, fallback = <Spinner /> }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};