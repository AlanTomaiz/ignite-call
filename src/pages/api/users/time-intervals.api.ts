import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const authOptions = buildNextAuthOptions(req, res)
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalBodySchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) =>
      prisma.userTimeInterval.create({
        data: {
          user_id: session.user.id,
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
        },
      }),
    ),
  )

  return res.status(201).end()
}

export default handler
