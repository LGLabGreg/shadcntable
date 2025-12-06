import { faker } from '@faker-js/faker'
import { NextResponse } from 'next/server'

import { type Person, makeData } from '@/lib/makeData'

const TOTAL_ROWS = 200
const API_DELAY_MS = 300 // Simulate network latency

let cachedRows: Person[] | null = null

function getAllRows(): Person[] {
  if (!cachedRows) {
    faker.seed(123)
    cachedRows = makeData(TOTAL_ROWS)
  }

  return cachedRows
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function GET(request: Request) {
  // Simulate network latency
  await delay(API_DELAY_MS)

  const { searchParams } = new URL(request.url)

  const pageParam = searchParams.get('page')
  const pageSizeParam = searchParams.get('pageSize')

  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const pageSize = Math.max(1, Number.parseInt(pageSizeParam ?? '10', 10) || 10)

  const allRows = getAllRows()
  const rowCount = allRows.length

  const start = (page - 1) * pageSize
  const end = start + pageSize

  const rows = allRows.slice(start, end)

  return NextResponse.json({
    rows,
    rowCount,
  })
}
