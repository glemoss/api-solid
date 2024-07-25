import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch gyms near under 10km', async () => {
    // Coordenadas com 9km de distância do usuário
    await gymsRepository.create({
      title: 'Gym 9',
      latitude: -22.9068,
      longitude: -43.1729,
      description: null,
    })

    await gymsRepository.create({
      title: 'Gym 9.1',
      latitude: -22.9098,
      longitude: -43.1729,
      description: null,
    })

    // Coordenadas com 10km de distância do usuário
    await gymsRepository.create({
      title: 'Gym 2',
      latitude: -22.81671,
      longitude: -43.1729,
      description: null,
    })

    const { gyms } = await sut.handle({
      userLatitude: -22.9068,
      userLongitude: -43.1729,
    })

    expect(gyms).length(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 9' }),
      expect.objectContaining({ title: 'Gym 9.1' }),
    ])
  })
})
