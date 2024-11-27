# ClimateNow

**ClimateNow** es una aplicación web diseñada para proporcionar información meteorológica actualizada y precisa, incluyendo pronósticos del tiempo, alertas de condiciones climáticas extremas y datos históricos. A través de esta plataforma, los usuarios podrán consultar información relevante sobre el clima en tiempo real.

**Repositorio**: [Proyecto ClimateNow en GitHub](https://github.com/MateoMP02/Proyecto-Final-Clima.git)

### Integrantes del Proyecto
Este proyecto fue desarrollado por los siguientes miembros:

- Mateo Martínez Prieto
- Sedares Otero Luca Agustín
- Hernán Cerillano
- Tomás Denk
- Ezequiel García

### Requisitos

- **Node.js** (se recomienda la última versión estable).
- **Angular CLI** para gestionar la aplicación de Angular.
- **Json-Server** para crear una API REST local que simula el servidor.

## Contribución
Las contribuciones son lo que hacen que la comunidad de código abierto sea un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será muy apreciada.

1. Haz un 'Fork' del proyecto.
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`).
3. Realiza tus cambios y haz un 'commit' (`git commit -m 'Add some AmazingFeature'`).
4. Sube tu rama (`git push origin feature/AmazingFeature`).
5. Abre un 'Pull Request'.
### Instalación

1. **Clonar el repositorio**:
   
Abre tu terminal y clona el repositorio en tu máquina:
   
```sh
git clone https://github.com/MateoMP02/Proyecto-Final-Clima.git
cd Proyecto-Final-Clima
```


Instalar Angular CLI de manera global:
```sh
npm install -g @angular/cli
```
Instalar Json-Server de manera global (para simular un servidor de datos locales):
```sh
  npm install -g json-server
```

Instalar dependencias del proyecto:
Una vez que hayas clonado el proyecto, instala las dependencias necesarias para el proyecto:
```sh
npm install
```
Instalar Leaflet para mapas interactivos:
```sh
npm install leaflet
npm install @types/leaflet --save-dev
```

Iniciar Json-Server (simulando una API):
En el proyecto raíz, crea un archivo db.json con los datos necesarios o usa los proporcionados, luego ejecuta el siguiente comando para arrancar el servidor de la API:
```sh
json-server -p 3000 db.json
```

Iniciar la aplicación de Angular:
Para iniciar la aplicación en modo de desarrollo, ejecuta:
```sh
ng serve -o
```
Esto abrirá la aplicación automáticamente en tu navegador en http://localhost:4200.
