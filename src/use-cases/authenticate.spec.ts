import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentials } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

describe('Register use case', () => {
  it('should be able to authenticate', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('password123', 6),
    })

    const { user } = await sut.handle({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(user.name).toBe('John Doe')
  })

  it('shouldnt be able to authenticate with wrong email', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    await expect(() =>
      sut.handle({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.to.toThrowError(InvalidCredentials)
  })

  it('shouldnt be able to authenticate if the password hashes dont match', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('password123', 6),
    })

    await expect(() =>
      sut.handle({
        email: 'john.doe@example.com',
        password: 'wrong password',
      }),
    ).rejects.to.toThrowError(InvalidCredentials)
  })
})
