import { Suspense } from 'react';
import { Spinner } from './Spinner'; // Предполагаем, что у нас есть компонент спиннера

export const LazyLoader = ({ children, fallback = <Spinner /> }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};