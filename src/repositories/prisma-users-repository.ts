import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const email = data.email

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists')
    }
    const newUser = await prisma.user.create({
      data,
    })

    return newUser
  }
}
