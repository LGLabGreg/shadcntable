import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PropDefinition {
  name: string
  type: string
  default?: string
  description: string
}

interface PropsTableProps {
  data: PropDefinition[]
}

export function PropsTable({ data }: PropsTableProps) {
  return (
    <div className='my-6 overflow-hidden rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/50'>
            <TableHead className='font-semibold'>Prop</TableHead>
            <TableHead className='font-semibold'>Type</TableHead>
            <TableHead className='font-semibold'>Default</TableHead>
            <TableHead className='font-semibold'>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className='font-mono text-sm font-medium'>{prop.name}</TableCell>
              <TableCell className='font-mono text-sm text-muted-foreground'>
                {prop.type}
              </TableCell>
              <TableCell className='font-mono text-sm'>
                {prop.default ?? <span className='text-muted-foreground'>-</span>}
              </TableCell>
              <TableCell className='text-sm'>{prop.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
