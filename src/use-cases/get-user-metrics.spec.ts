import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from an user', async () => {
    checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })
    checkInsRepository.create({
      gymId: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.handle({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(2)
  })
})
