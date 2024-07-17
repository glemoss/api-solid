import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('password123', 6),
    })

    const { user } = await sut.handle({
      userId: createdUser.id,
    })

    expect(user.name).toBe('John Doe')
  })

  it('shouldnt be able to get user profile with wrong user id', async () => {
    await expect(() =>
      sut.handle({
        userId: 'id-random',
      }),
    ).rejects.to.toThrowError(ResourceNotFound)
  })
})
