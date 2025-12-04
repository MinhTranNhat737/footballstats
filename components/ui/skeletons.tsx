import { Skeleton } from "@/components/ui/skeleton"

export function MatchCardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="grid grid-cols-12 gap-3 items-center min-h-[40px]">
        {/* Home team logo */}
        <div className="col-span-1 flex justify-center">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        
        {/* Home team name */}
        <div className="col-span-4">
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* VS/Score section */}
        <div className="col-span-2 flex justify-center">
          <Skeleton className="w-14 h-6 rounded" />
        </div>
        
        {/* Away team name */}
        <div className="col-span-4">
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Away team logo */}
        <div className="col-span-1 flex justify-center">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      
      {/* Match info row */}
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-4">
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="col-span-4 flex justify-center">
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="col-span-4 flex justify-end">
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

export function MatchListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <MatchCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function FilterBarSkeleton() {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-end">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      </div>
    </header>
  )
}

export function LiveStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-8 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function CompetitionSkeleton() {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-8 h-8 rounded" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="ml-auto">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    </div>
  )
}

export function MatchDetailSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      {/* Match header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-6 w-32 mx-auto" />
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      
      {/* Match stats */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton className="h-4 w-16 mx-auto mb-1" />
            <Skeleton className="h-6 w-8 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}