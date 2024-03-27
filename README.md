# api-adonis-reto

API REST que gestiona los movimientos de clientes.

---

## Build Setup

```bash
# Versión de trabajo en local  (comando: node -v)
$ v20.6.0

```

### `RAMAS DE TRABAJO`

```bash
# La actual rama de trabajo al clonar el proyecto (commando: git branch)
$ master

# La rama principal de trabajo
$ git checkout master
```

### `VARIABLES DE ENTORNO (.env)`

````bash
# copiar el archivo .env.example
$ cp .env.example .env

# configurar BBDDD
$ DB_HOST=mysql-eamtec-bd-2023-10-10-do-user-14673335-0.b.db.ondigitalocean.com
$ DB_PORT=25060
$ DB_USER=doadmin
$ DB_DATABASE=reto_promart

# Configurar las variables generales del proyecto
$ TZ='America/Lima'
$ PORT=3333
$ HOST=localhost
$ LOG_LEVEL=info


### `BACK-END (Adonis + Lucid)`
```bash
# BBDD
$ crear un BBDD llamada `${DB_DATABASE}`

# serve with hot reload at localhost:3333
$ npm run dev

# build for production and launch server
$ npm install -g pm2
$ pm2 start ace.js --name "apiReto"
$ pm2 update
$ pm2 logs apiReto
````

### `RUTAS DEL API`

$ API_RETO_PROMART = http://localhost:3333/ (default)

{{API_RETO_PROMART}}/client (GET) : Listar los clientes registrados
{{API_RETO_PROMART}}/client/:id (GET): Listar un cliente por su ID
{{API_RETO_PROMART}}/client (POST): Agregar un nuevo cliente
{{API_RETO_PROMART}}/client/:id (PUT): Actualizar los datos de un cliente
{{API_RETO_PROMART}}/client/:id (DELETE): Eliminación lógica de un cliente
