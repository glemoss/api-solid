import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkIn'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.handle({
      userId: 'user id',
      gymId: 'gym id',
    })

    expect(checkIn.user_id).toBe('user id')
  })

  it('shouldnt be able to check in twice a day', async () => {
    await sut.handle({
      userId: 'user id',
      gymId: 'gym id',
    })

    expect(async () => {
      await sut.handle({
        userId: 'user id',
        gymId: 'gym id',
      })
    }).rejects.toThrowError(Error)
  })
})
