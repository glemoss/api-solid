import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })
  it('should be able to search for gyms by its title', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.handle({
      query: 'Gym',
      page: 1,
    })

    expect(gyms).length(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      })
    }

    const { gyms } = await sut.handle({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).length(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
