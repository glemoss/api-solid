import { FastifyInstance } from 'fastify'
import { register } from './controllers/register.controller'
import { authenticate } from './controllers/authenticate.controller'
import { profile } from './controllers/profile.controller'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', authenticate)

  //  Authenticated routes
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
