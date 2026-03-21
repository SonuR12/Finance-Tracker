"use client";

import React from "react";

const S = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 ${className}`} style={style} />
);

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3.5 sm:p-5 bg-white dark:bg-neutral-900">
          <div className="flex items-start justify-between mb-3">
            <S className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
            <S className="h-5 w-12 rounded-full" />
          </div>
          <S className="h-3 w-20 mb-1" />
          <S className="h-6 sm:h-8 w-28 mb-1" />
          <S className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function IncomeExpenseChartSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 lg:h-[320px] h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1.5">
          <S className="h-4 w-36" />
          <S className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <S className="h-7 w-20 rounded-full" />
          <S className="h-7 w-20 rounded-full" />
        </div>
      </div>
      <S className="h-[210px] w-full rounded-xl" />
    </div>
  );
}

function AIInsightsSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <S className="h-7 w-7 rounded-lg" />
          <div className="space-y-1.5">
            <S className="h-4 w-24" />
            <S className="h-3 w-32" />
          </div>
        </div>
        <S className="h-7 w-7 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-100 dark:border-neutral-800 p-3.5">
            <div className="flex gap-2.5">
              <S className="h-6 w-6 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <S className="h-3.5 w-3/4" />
                <S className="h-3 w-full" />
                <S className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpendingChartSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="space-y-1.5 mb-5">
        <S className="h-4 w-36" />
        <S className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-6">
        <S className="h-40 w-40 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <S className="h-3 w-3 rounded-full flex-shrink-0" />
              <S className="h-3 flex-1" />
              <S className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeeklyChartSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1.5">
          <S className="h-4 w-32" />
          <S className="h-3 w-24" />
        </div>
        <S className="h-7 w-24 rounded-full" />
      </div>
      <div className="flex items-end justify-between gap-2 h-[180px] px-1">
        {[65, 40, 80, 55, 90, 45, 70].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <S className="w-full rounded-t-md" style={{ height: `${h}%` }} />
            <S className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactionsSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-[420px] sm:h-[380px]">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1.5">
          <S className="h-4 w-40" />
          <S className="h-3 w-24" />
        </div>
        <div className="flex gap-1.5">
          <S className="h-7 w-12 rounded-full" />
          <S className="h-7 w-16 rounded-full" />
          <S className="h-7 w-20 rounded-full" />
        </div>
      </div>
      <S className="h-9 w-full rounded-lg mb-3" />
      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5">
            <S className="h-9 w-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <S className="h-3.5 w-32" />
              <S className="h-3 w-24" />
            </div>
            <S className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetProgressSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-[420px] sm:h-[380px]">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-1.5">
          <S className="h-4 w-28" />
          <S className="h-3 w-20" />
        </div>
        <S className="h-3 w-20" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <S className="h-3.5 w-20" />
              <S className="h-3 w-24" />
            </div>
            <S className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-30 h-14 flex items-center justify-between sm:pl-5 sm:pr-5 pr-6 pl-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <S className="h-9 w-9 rounded-xl lg:hidden" />
        <div className="hidden lg:flex items-center gap-2.5">
          <S className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <S className="h-3.5 w-24" />
            <S className="h-2.5 w-32" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <S className="h-9 w-9 rounded-xl" />
        <S className="h-9 w-9 rounded-full lg:hidden" />
      </div>
    </div>
  );
}

function GreetingSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <S className="h-7 w-56" />
        <S className="h-4 w-40" />
      </div>
      <S className="hidden sm:block h-8 w-28 rounded-xl" />
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="hidden lg:flex flex-col h-screen w-60 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <S className="h-5 w-5 rounded" />
          <S className="h-4 w-16" />
        </div>
        <S className="h-6 w-6 rounded-md" />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-4 overflow-hidden">
        {[3, 5, 4, 2].map((count, g) => (
          <div key={g} className="space-y-0.5">
            <S className="h-2.5 w-16 mb-2" />
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <S className="h-4 w-4 rounded flex-shrink-0" />
                <S className="h-3.5 flex-1" />
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <S className="h-4 w-4 rounded flex-shrink-0" />
          <S className="h-3.5 w-16" />
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <S className="h-7 w-7 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <S className="h-3 w-24" />
            <S className="h-2.5 w-32" />
          </div>
          <S className="h-3.5 w-3.5 rounded flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <SidebarSkeleton />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <HeaderSkeleton />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 lg:pt-6">
          <div className="space-y-4 sm:space-y-6">
            <GreetingSkeleton />
            <StatCardsSkeleton />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><IncomeExpenseChartSkeleton /></div>
              <AIInsightsSkeleton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpendingChartSkeleton />
              <WeeklyChartSkeleton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><RecentTransactionsSkeleton /></div>
              <BudgetProgressSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
