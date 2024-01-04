import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useCallback, useMemo, useState } from 'react'
import { api } from '../../lib/axios'
import { getWeekDays } from '../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedDates: number[]
  blockedWeekDays: number[]
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const router = useRouter()
  const username = router.query.username as string

  const shortWeekDays = getWeekDays({ short: true })

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blocked-dates',
      currentDate.get('year'),
      currentDate.get('month'),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })

      return response.data
    },
  })

  // Parse dates
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const filterAvailabilityDays = useCallback(
    (date: dayjs.Dayjs) => ({
      date,
      disabled: !!(
        date.endOf('day').isBefore(new Date()) ||
        blockedDates?.blockedWeekDays.includes(date.get('day')) ||
        blockedDates?.blockedDates.includes(date.get('date'))
      ),
    }),
    [blockedDates],
  )

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => currentDate.set('date', index + 1))

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    // Previous Month
    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, index) => currentDate.subtract(index + 1, 'day'))
      .reverse()

    // Next Month
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => lastDayInCurrentMonth.add(index + 1, 'day'))

    // Results
    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map(filterAvailabilityDays),
      ...nextMonthFillArray.map(filterAvailabilityDays),
    ]

    return calendarDays.reduce<CalendarWeeks>((weeks, _, index, origin) => {
      const weekHasEnded = index % 7 === 0

      if (weekHasEnded) {
        weeks.push({
          week: index / 7 + 1,
          days: origin.slice(index, index + 7),
        })
      }

      return weeks
    }, [])
  }, [currentDate, filterAvailabilityDays])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Próximo mês">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <CalendarDay
                    disabled={disabled}
                    onClick={() => onDateSelected(date.toDate())}
                  >
                    {date.get('date')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
