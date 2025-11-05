import type { Metadata } from 'next';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist',
};

export default function NotFound() {
  return <NotFoundPage />;
}
