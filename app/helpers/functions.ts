import logger from '@adonisjs/core/services/logger'

export interface ValidationResult {
  status: boolean
  message?: string
}

export function validateBirthdate(birthdate: Date): ValidationResult {
  const now = new Date()

  // Verificar si la fecha de nacimiento es una fecha futura
  if (birthdate > now) {
    const message = 'La fecha de nacimiento es una fecha futura'
    logger.error(`validateBirthdate: ${message}`)
    return {
      status: false,
      message: `Error: ${message}`,
    }
  }

  // Crear una fecha que represente hace 18 años desde la fecha actual
  const eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

  // Comparar la fecha de nacimiento recibida con la fecha hace 18 años
  if (birthdate > eighteenYearsAgo) {
    const message = 'La fecha de nacimiento indica que el cliente es menor de edad'
    logger.error(`validateBirthdate: ${message}`)
    return {
      status: false,
      message: `Error: ${message}`,
    }
  }

  // Si la fecha de nacimiento es válida (no es una fecha futura y el cliente tiene al menos 18 años), retornar null
  return { status: true }
}

export function calculateAge(birthdate: Date): number {
  const today = new Date()
  const birthDate = new Date(birthdate)

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  // Si aún no se ha alcanzado el día del cumpleaños de este año, reste un año
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

type DataClient = {
  name: string
  surname: string
  email: string
  birthdate: Date
}

export function validateClient(datos: DataClient): boolean {
  let response = true
  if (!datos.name || !datos.surname || !datos.email || !datos.birthdate) {
    response = false
  }

  return response
}
