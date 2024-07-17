import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should create a new user', async () => {
    const { user } = await sut.handle({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(user.name).to.equal('John Doe')
    expect(user.email).to.equal('john.doe@example.com')
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.handle({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })

    const isCorrectlyHashed = await compare('password123', user.password_hash)

    expect(isCorrectlyHashed).toBe(true)
  })

  it('shouldnt be able to create user with same email', async () => {
    const email = 'john.doe@example.com'

    await sut.handle({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    await expect(() =>
      sut.handle({
        name: 'John Doe',
        email,
        password: 'password123',
      }),
    ).rejects.to.toThrowError(UserAlreadyExistsError)
  })
})
