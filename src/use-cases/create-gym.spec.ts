import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should create a new gym', async () => {
    const { gym } = await sut.handle({
      title: 'Test Gym',
      description: 'Test Description',
      phone: '749317481',
      latitude: 0,
      longitude: 0,
    })

    expect(gym.title).to.equal('Test Gym')
    expect(gym.description).to.equal('Test Description')
    expect(gym.id).toEqual(expect.any(String))
  })
})
