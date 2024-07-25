import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const updateCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    })

    return updateCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startofTheDay = dayjs(date).startOf('day')
    const endofTheDay = dayjs(date).endOf('day')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startofTheDay.toDate(),
          lt: endofTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
    })

    return checkIns
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const checkInsCount = await prisma.checkIn.count({
      where: { user_id: userId },
    })

    return checkInsCount
  }
}
