import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async handle({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    await this.usersRepository.create({ name, email, password_hash })
  }
}
