import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate check-in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
    const checkInToBeValidated = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.handle({
      checkInId: checkInToBeValidated.id,
    })

    expect(checkIn.validated_at).not.toBeNull()
    expect(checkIn.validated_at).toBeInstanceOf(Date)
    expect(checkInsRepository.items[0].validated_at).toBeInstanceOf(Date)
  })

  it('shouldnt be able to validate a non existent check-in', async () => {
    await expect(() =>
      sut.handle({
        checkInId: 'non existent check-in id',
      }),
    ).rejects.to.toThrowError(ResourceNotFoundError)
  })

  it('shouldnt be able to validate a check-in after 20 minutes of its creation', async () => {
    const checkInToBeValidated = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.handle({
        checkInId: checkInToBeValidated.id,
      }),
    ).rejects.toThrowError(LateCheckInValidationError)
  })
})
