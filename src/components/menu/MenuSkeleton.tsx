import { motion } from 'framer-motion';

export function MenuSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <div className="h-40 animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
        <div className="h-4 w-full rounded-lg animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 w-16 rounded-lg animate-shimmer" />
          <div className="h-9 w-9 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function MenuSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MenuSkeleton key={i} />
      ))}
    </div>
  );
}
