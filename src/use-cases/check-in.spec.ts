import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym id',
      title: 'Gym Name',
      latitude: 0,
      longitude: 0,
      phone: '',
      description: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.handle({
      userId: 'user id',
      gymId: 'gym id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.user_id).toBe('user id')
  })

  it('shouldnt be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    await sut.handle({
      userId: 'user id',
      gymId: 'gym id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    await expect(() =>
      sut.handle({
        userId: 'user id',
        gymId: 'gym id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.to.toThrowError(MaxNumberCheckInsError)
  })

  it('shouldnt be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym id2',
      title: 'Gym 2',
      latitude: new Decimal(-27.5848172),
      longitude: new Decimal(-48.5097472),
      phone: '',
      description: '',
    })

    expect(async () => {
      await sut.handle({
        userId: 'user id',
        gymId: 'gym id2',
        userLatitude: -27.5918999,
        userLongitude: -48.6603737,
      })
    }).rejects.to.toThrowError(MaxDistanceError)
  })
})
