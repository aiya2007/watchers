import Link from 'next/link';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-400">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">404 - Not Found</h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8 text-sm">
        The title, person, or page you were looking for could not be found or may have been removed.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
