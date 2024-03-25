import type { HttpContext } from '@adonisjs/core/http'
import { validateBirthdate, calculateAge, validateClient } from '#helpers/functions'
import logger from '@adonisjs/core/services/logger'
import Client from '#models/client'

export default class ClientsController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    let { page, perpage } = request.qs()
    page = page ? parseInt(page) * perpage : 0
    perpage = perpage ? parseInt(perpage) : 10

    const clients = await Client.query()
      .select('id', 'full_name', 'age', 'birthdate')
      .where('status', 1)
      .offset(page)
      .limit(perpage)

    return response.status(200).json({ data: clients })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      // Obtener los datos del formulario
      let { name, surname, mothers_surname, email, birthdate } = request.only([
        'name',
        'surname',
        'mothers_surname',
        'email',
        'birthdate',
      ])

      // Verificar si el email ya está registrado
      const existingClient = await Client.findBy('email', email)
      if (existingClient) {
        logger.error(`ClientsController.store: El email ya está registrado en la base de datos`)
        return response
          .status(400)
          .json({ error: 'Error: El email ya está registrado en la base de datos' })
      }

      // Validar la fecha de nacimiento
      const validationResult = validateBirthdate(new Date(birthdate))
      if (!validationResult.status) {
        return response.status(400).json({ error: validationResult.message })
      }

      // Calcular la edad del cliente
      const age = calculateAge(new Date(birthdate))
      const full_name = mothers_surname
        ? `${name} ${surname} ${mothers_surname}`
        : `${name} ${surname}`

      const data = {
        name,
        surname,
        mothers_surname,
        full_name,
        email,
        birthdate,
        age,
      }

      // Validar los campos del formulario
      const validate = validateClient(data)
      if (!validate) {
        logger.error(
          `ClientsController.store: Todos los campos son obligatorios, excepto mothers_surname`
        )

        return response
          .status(400)
          .json({ error: 'Error: Todos los campos son obligatorios, excepto mothers_surname' })
      }

      const client = new Client()
      client.fill(data)
      await client.save()

      response.status(201).json({ message: 'Cliente creado exitosamente', data: client })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    //const client = await Client.find(request.param('id'))
    const client = await Client.query()
      .select('name', 'surname', 'mothers_surname', 'email', 'birthdate', 'age')
      .where('id', request.param('id'))
      .first()

    return response.status(200).json({ data: client })
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */

  async update({ request, response, params }: HttpContext) {
    try {
      // Obtener los datos del formulario
      let data = request.only(['name', 'surname', 'mothers_surname', 'email', 'birthdate'])

      // Obtener el cliente existente por su ID
      const client = await Client.find(request.param('id'))
      if (!client) {
        logger.error(`ClientsController.update: El cliente no existe en la base de datos`)
        return response.status(404).json({ message: 'Cliente no existe en la base de datos' })
      }

      // Verificar si el nuevo email ya está registrado para otro cliente
      if (data.email !== client.email) {
        const existingClient = await Client.findBy('email', data.email)
        if (existingClient && existingClient.id !== params.id) {
          logger.error(`ClientsController.update: El email ya está registrado en la base de datos`)
          return response
            .status(400)
            .json({ message: 'Error: El email ya está registrado en la base de datos' })
        }
      }

      // Validar la fecha de nacimiento
      const validationResult = validateBirthdate(new Date(data.birthdate))
      if (!validationResult.status) {
        return response.status(400).json({ message: validationResult.message })
      }

      // CALCULANDO EDAD
      const age = calculateAge(new Date(data.birthdate))
      const full_name = data.mothers_surname
        ? `${data.name} ${data.surname} ${data.mothers_surname}`
        : `${data.name} ${data.surname}`

      // VALIDAR CAMPOS DEL FORMULARIO
      const validate = validateClient(data)
      if (!validate) {
        logger.error(
          `ClientsController.update: Todos los campos son obligatorios, excepto mothers_surname`
        )
        return response
          .status(400)
          .json({ message: 'Error: Todos los campos son obligatorios, excepto mothers_surname' })
      }

      const { name, surname, mothers_surname, email, birthdate } = data

      // ACTUALIZANDO
      client.merge({
        name,
        surname,
        mothers_surname,
        full_name,
        email,
        birthdate,
        age,
      })

      await client.save()

      return response
        .status(200)
        .json({ message: 'Cliente actualizado correctamente', data: client })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const id = request.param('id')
    const client = await Client.find(id)
    if (!client) {
      logger.error(`ClientsController.destroy: El cliente no existe en la base de datos`)
      return response.status(404).json({ message: 'Client no encontrado en la base de datos' })
    }

    client.status = 0
    await client.save()

    // await client.delete()
    return response.status(200).json({ message: 'Cliente eliminado exitosamente', data: id })
  }
}
