<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la DB
```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar a __.env__. LLenar las variables de entorno definidas

6. Levantar el proyecto
```
yarn start:dev
```

7. Recargar base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest


# Production Build
1. crear el archivo __.env.prod__

2. Llenar las variables de entorno en produccion

3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

