import { TrendingUp } from '@/icons/TrendingUp'
import { Caption } from '@/ui/typography/Caption'

type Props = {
  number: number
}

export const DashboardBadge = ({number}: Props) => {
  return (
    <div className='flex w-4/5 px-2 items-center gap-1 bg-success-100'>
      <Caption variant="small" color="text-success-600">
        + {number.toString().replace('.', ',')}
      </Caption>
      <TrendingUp />
    </div>
  )
}