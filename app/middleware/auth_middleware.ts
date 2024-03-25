import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Env from '#start/env'

export default class AuthMiddleware {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    // Verificar si se ha proporcionado un token de autorización
    const token = request.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      const message = 'Token de autenticación no proporcionado'
      logger.error(`AuthMiddleware: ${message}`)
      return response.status(401).json({ error: `${message}` })
    }

    // Verificar si el token coincide con el valor en .env
    const authToken = Env.get('AUTH_TOKEN')
    if (token !== authToken) {
      const message = 'Token de autenticación no válido'
      logger.error(`AuthMiddleware: ${message}`)
      return response.status(401).json({ error: `${message}` })
    }

    // Continuar con la siguiente capa del middleware si la autenticación es exitosa
    await next()
  }
}
