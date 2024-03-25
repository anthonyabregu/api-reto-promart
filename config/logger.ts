import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'
import { fileURLToPath } from 'url'
import path from 'path'

// const loggerConfig = defineConfig({
//   default: 'app',

//   /**
//    * The loggers object can be used to define multiple loggers.
//    * By default, we configure only one logger (named "app").
//    */
//   loggers: {
//     app: {
//       enabled: true,
//       name: env.get('APP_NAME'),
//       level: env.get('LOG_LEVEL'),
//       transport: {
//         targets: targets()
//           .pushIf(!app.inProduction, targets.pretty())
//           .pushIf(app.inProduction, targets.file({ destination: 1 }))
//           .toArray(),
//       },
//     },
//   },
// })

// export default loggerConfig

// /**
//  * Inferring types for the list of loggers you have configured
//  * in your application.
//  */
// declare module '@adonisjs/core/types' {
//   export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
// }

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: {
        targets: targets()
          .pushIf(!app.inProduction, targets.pretty())
          .pushIf(
            app.inProduction,
            targets.file({ destination: path.join(__dirname, '..', 'logs', 'app.log') })
          )
          .toArray(),
      },
    },
  },
})

export default loggerConfig

declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
