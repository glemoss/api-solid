import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch user check-ins history use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-ins history from an user', async () => {
    checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })
    checkInsRepository.create({
      gymId: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.handle({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).lengthOf(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-01' }),
      expect.objectContaining({ gymId: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-ins history from an user', async () => {
    for (let i = 0; i < 22; i++) {
      checkInsRepository.create({
        gymId: `gym-${i}`,
        user_id: 'user-0',
      })
    }

    const { checkIns } = await sut.handle({
      userId: 'user-0',
      page: 2,
    })
    expect(checkIns).lengthOf(2)
  })
})
