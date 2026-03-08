const SkeletonGrid = () => (
  <div className="relative z-10 max-w-7xl mx-auto px-4 mb-16">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden">
          <div className="h-48 skeleton-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 rounded skeleton-pulse" />
            <div className="h-3 w-full rounded skeleton-pulse" />
            <div className="h-3 w-2/3 rounded skeleton-pulse" />
            <div className="flex justify-between mt-4">
              <div className="h-3 w-16 rounded skeleton-pulse" />
              <div className="h-3 w-20 rounded skeleton-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonGrid;
