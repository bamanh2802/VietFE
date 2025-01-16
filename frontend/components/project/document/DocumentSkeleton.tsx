'use client'

import React from 'react'
import { Skeleton } from "@nextui-org/skeleton"

export function DocumentSkeleton() {
  return (
    <div className="space-y-4 w-full h-[calc(100vh-160px)] max-w-3xl mx-auto p-4">
      <Skeleton className="w-3/4 h-8 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-5/6 h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-3/4 h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-5/6 h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-3/4 h-4 rounded-lg" />
    </div>
  )
}

