import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbBackProps {
  /** Parent section label, e.g. "Support", "Orders" */
  parentLabel: string;
  /** URL to navigate back to the parent */
  parentUrl: string;
  /** Current page label shown after the separator */
  currentPage: string;
  /** Optional additional class for the container */
  className?: string;
}

/**
 * Professional breadcrumb-style back navigation.
 * Renders: "Parent > Current Page" with Parent as a link.
 * Use when page is opened from Support, Profile, Orders, or Settings.
 */
export default function BreadcrumbBack({
  parentLabel,
  parentUrl,
  currentPage,
  className = '',
}: BreadcrumbBackProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-sm ${className}`}
    >
      <Link
        to={parentUrl}
        className="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {parentLabel}
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" aria-hidden />
      <span className="font-medium text-gray-900 dark:text-white">
        {currentPage}
      </span>
    </nav>
  );
}
