import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '../../../../components/Calendar'
import { api } from '../../../../lib/axios'
import {
  Container,
  TimePickerItem,
  TimePickerList,
  TimerPicker,
  TimerPickerHeader,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const hasSelectedDate = !!selectedDate
  const username = router.query.username as string

  const weekDay = hasSelectedDate ? dayjs(selectedDate).format('dddd') : null
  const expansiveDate = hasSelectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    enabled: !!selectedDate,
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
  })

  // useEffect(() => {
  //   if (!selectedDate) {
  //     return
  //   }

  //   api
  //     .get(`/users/${username}/availability`, {
  //       params: {
  //         date: dayjs(selectedDate).format('YYY-MM-DD'),
  //       },
  //     })
  //     .then((response) => setAvailability(response.data))
  // }, [selectedDate, username])

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={hasSelectedDate}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {hasSelectedDate && (
        <TimerPicker>
          <TimerPickerHeader>
            {weekDay} <span>{expansiveDate}</span>
          </TimerPickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((time) => (
              <TimePickerItem
                key={String(time)}
                disabled={!availability.availableTimes.includes(time)}
                onClick={() => handleSelectTime(time)}
              >
                {String(time).padStart(2, '0')}
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimerPicker>
      )}
    </Container>
  )
}
