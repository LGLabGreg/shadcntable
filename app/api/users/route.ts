import { faker } from '@faker-js/faker'
import { NextResponse } from 'next/server'

import { type Person, makeData } from '@/lib/makeData'

const TOTAL_ROWS = 200
const API_DELAY_MS = 300 // Simulate network latency
const SORTABLE_KEYS = ['firstName', 'lastName', 'email'] as const

type SortableKey = (typeof SORTABLE_KEYS)[number]

let cachedRows: Person[] | null = null

function getAllRows(): Person[] {
  if (!cachedRows) {
    faker.seed(123)
    cachedRows = makeData(TOTAL_ROWS)
  }
  return cachedRows
}

function isSortableKey(key: string | null): key is SortableKey {
  return SORTABLE_KEYS.includes(key as SortableKey)
}

function toPositiveInt(value: string | null, fallback: number): number {
  return Math.max(1, Number.parseInt(value ?? '', 10) || fallback)
}

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS))

  const { searchParams } = new URL(request.url)
  const page = toPositiveInt(searchParams.get('page'), 1)
  const pageSize = toPositiveInt(searchParams.get('pageSize'), 10)
  const search = searchParams.get('search')?.trim().toLowerCase()
  const sort = searchParams.get('sort')
  const desc = searchParams.get('desc') === 'true'

  let rows = getAllRows()

  if (search) {
    rows = rows.filter((person) =>
      [person.firstName, person.lastName, person.email].some((value) =>
        value.toLowerCase().includes(search),
      ),
    )
  }

  if (isSortableKey(sort)) {
    rows = rows.toSorted((a, b) => a[sort].localeCompare(b[sort]) * (desc ? -1 : 1))
  }

  const start = (page - 1) * pageSize

  return NextResponse.json({
    rows: rows.slice(start, start + pageSize),
    rowCount: rows.length,
  })
}
