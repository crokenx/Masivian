# Roulette API

* Endpoint de creación de nuevas ruletas que devuelva el id de la nueva ruleta creada
* Endpoint de apertura de ruleta (el input es un id de ruleta) que permita las
  posteriores peticiones de apuestas, este debe devolver simplemente un estado que
  confirme que la operación fue exitosa o denegada
* Endpoint de apuesta a un número (los números válidos para apostar son del 0 al 36)
  o color (negro o rojo) de la ruleta una cantidad determinada de dinero (máximo
  10.000 dólares) a una ruleta abierta.
  (nota: este enpoint recibe además de los parámetros de la apuesta, un id de usuario
  en los HEADERS asumiendo que el servicio que haga la petición ya realizo una
  autenticación y validación de que el cliente tiene el crédito necesario para realizar la
  apuesta)
* Endpoint de cierre apuestas dado un id de ruleta, este endpoint debe devolver el
 resultado de las apuestas hechas desde su apertura hasta el cierre.
* Endpoint de listado de ruletas creadas con sus estados (abierta o cerrada)

# Requeridos: NodeJs, Redis
## Instalar NodeJs
### Si estas en Linux/MacOs
https://nodejs.org/es/download/package-manager/
### Si estas en Windows 
https://nodejs.org/es/download/
## Instalar redis
### Si estas en Linux/MacOs
https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298
### Si estas en Windows 
https://riptutorial.com/es/redis/example/29962/instalacion-y-ejecucion-de-redis-server-en-windows

# Instalacion
### 1. Descargar/clonar el repositorio
### 2. Ingresar a la carpeta desde bash (linux/MacOs) o cmd (windows)
### 3. correr el comando npm i
### 4. correr el comando npm start

# Usage
## Desde Postman
### 1. http://localhost:4000/createRoulette (Creacion de ruletas, tipo get)
### 2. http://localhost:4000/openRouletteById/:roulette_id (Apertura de ruleta, tipo post)
### 3. http://localhost:4000/makeBet (Apuesta a un numero, tipo post)
### 4. http://localhost:4000/closeRouletteById/:roulette_id (Cierre de ruleta, tipo post)
### 2. http://localhost:4000/getRoulettes (Listado de ruletas con su estado, tipo get)
### Ejemplos Json para hacer apuesta 

### {
###    "value":"5000",
###    "colour":"black"
### }

### {
###    "value":"5000",
###    "betNumber":"black"
### }