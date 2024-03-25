import { BaseSchema } from '@adonisjs/lucid/schema'
import moment from 'moment-timezone'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    const now = moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')
    console.log(now)
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.string('mothers_surname').nullable().defaultTo(null)
      table.string('full_name').nullable().defaultTo(null)
      table.string('email').notNullable().unique()
      table.date('birthdate').notNullable()
      table.integer('age').notNullable()
      table.integer('status').notNullable().defaultTo(1)
      table.timestamp('created_at').defaultTo(now)
      table.timestamp('updated_at').defaultTo(now)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
