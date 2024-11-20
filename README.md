# ClimateNow

**ClimateNow** es una aplicación web diseñada para proporcionar información meteorológica actualizada y precisa, incluyendo pronósticos del tiempo, alertas de condiciones climáticas extremas y datos históricos. A través de esta plataforma, los usuarios podrán consultar información relevante sobre el clima en tiempo real.

**Repositorio**: [Proyecto ClimateNow en GitHub](https://github.com/MateoMP02/Proyecto-Final-Clima.git)

### Integrantes del Proyecto
Este proyecto fue desarrollado por los siguientes miembros:

Mateo Martínez Prieto
Sedares Otero Luca Agustín
Hernán Cerillano
Tomás Denk
Ezequiel García

## Descripción

**ClimateNow** es una plataforma que proporciona los siguientes servicios:

- **Clima actual** y **pronóstico** a corto y largo plazo para cualquier ubicación.
- **Alertas** de condiciones climáticas extremas.
- **Personalización** de la experiencia con temas y unidades de medida.
- **Creación y gestión de cuentas de usuario**, donde podrán visualizar y modificar sus datos, incluyendo lugares favoritos y su ubicación de residencia.

Sin embargo, no incluirá funciones de redes sociales ni personalización extensiva más allá de los temas y unidades de medida.

## Beneficios, Objetivos y Metas

### Beneficios de ClimateNow

- **Accesibilidad**: Los usuarios podrán acceder fácilmente a la información meteorológica desde cualquier dispositivo con acceso a Internet.
- **Fiabilidad**: Información precisa y actualizada sobre las condiciones meteorológicas.
- **Facilidad de uso**: Interfaz amigable para el usuario con un diseño claro y sencillo.

### Objetivos

- Proporcionar una herramienta confiable para consultar el clima.
- Permitir la personalización básica de la experiencia del usuario.
- Ofrecer una solución web ligera para la consulta rápida de datos meteorológicos.

### Metas

- **Creación y gestión de cuentas**: Los usuarios podrán crear cuentas, iniciar sesión, cerrar sesión y recuperar contraseñas olvidadas.
- **Personalización del perfil**: Los usuarios podrán personalizar su experiencia, elegir temas y unidades de medida.
- **Consultas meteorológicas**: Los usuarios podrán consultar el clima actual y los pronósticos del tiempo en su ciudad o lugares favoritos.

---

## Instalación

Sigue estos pasos para instalar y ejecutar **ClimateNow** en tu máquina local.

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
