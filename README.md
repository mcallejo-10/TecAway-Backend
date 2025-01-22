# TecAway Backend

TecAway es una aplicación diseñada para facilitar la conexión entre técnicos/as de teatro y quienes buscan profesionales para sus producciones. Este repositorio contiene el backend del proyecto, encargado de gestionar la lógica de negocio, el almacenamiento de datos y las interacciones con la base de datos.

## Características Principales

- Autenticación basada en tokens JWT.
- Gestión de perfiles de usuarios y técnicos/as.
- Validación y almacenamiento de datos mediante Sequelize y MySQL.
- Servicio de subida de imágenes con Cloudinary.
- Configuración y despliegue simplificados en Railway.

## Tecnologías Utilizadas

- **Lenguaje principal:** JavaScript (ES6+)
- **Framework:** Node.js con Express
- **Base de datos:** MySQL, manejada con Sequelize
- **Almacenamiento de archivos:** Cloudinary
- **Despliegue:** Railway

## Estructura del Proyecto

```
src
├── cloudinaryConfig.js          # Configuración para Cloudinary
├── controllers                  # Controladores de la lógica de negocio
│   ├── authController.js
│   ├── knowledgeController.js
│   ├── sectionController.js
│   ├── testController.js
│   ├── userController.js
│   └── userKnowledgeController.js
├── db.js                        # Configuración de la base de datos
├── index.js                     # Punto de entrada del servidor
├── middlewares                  # Middlewares personalizados
│   ├── authenticateToken.js     # Verificación de JWT
│   └── upload.js                # Gestión de subida de archivos
├── models                       # Modelos de Sequelize
│   ├── knowledgeModel.js
│   ├── recoveryTokenModel.js
│   ├── sectionModel.js
│   ├── userKnowledgeModel.js
│   ├── userModel.js
│   └── userSectionModel.js
├── railwayConfig.js             # Configuración para Railway
├── routes                       # Rutas de la API
│   ├── authRoutes.js
│   ├── knowledgeRoutes.js
│   ├── sectionRoutes.js
│   ├── testRoutes.js
│   ├── userKnowledgeRoutes.js
│   └── userRoutes.js
├── start_data.js                # Datos iniciales
├── utils                        # Utilidades generales
│   ├── cloudinaryService.js     # Servicio para Cloudinary
│   ├── email
│   │   ├── sendEmail.js         # Envío de correos electrónicos
│   │   └── template
│   │       └── requestResetPassword.handlebars
│   └── utils.js                 # Funciones auxiliares
└── validations                  # Validaciones de datos
    ├── auth.Validation.js
    ├── generic.Validation.js
    ├── knowledge.Validation.js
    ├── section.Validation.js
    ├── user.Validation.js
    └── userKnowledge.Validation.js
```

## Despliegue

Este proyecto está configurado para ser desplegado automáticamente en Railway. Al realizar cambios en el repositorio, Railway gestionará el despliegue de forma automática.


