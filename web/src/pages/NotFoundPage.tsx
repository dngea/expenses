import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="space-y-2 py-8 text-center">
      <p className="text-lg font-medium">Page not found</p>
      <Link to="/" className="text-teal-700 underline">Back to home</Link>
    </div>
  );
}
