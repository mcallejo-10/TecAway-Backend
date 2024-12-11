import UserSection from '../models/userSectionModel.js';
import { validationResult } from 'express-validator';

export const getUserSections = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const userSections = await UserSection.findAll();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'UserSections List',
      data: userSections
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener las secciones del usuario',
    });
  }
};

export const getUerSectionById = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const UserSection = await UserSection.findByPk(id);
    if (!userSection) {
      return res.status(404).json({
        code: -6,
        message: 'Sección del usuario no encontrada'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'UserSection Detail',
      data: userSection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener sección'
    });
  }
};

export const addUserSection = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userSection} = req.body;
    let newUserSection;
    try {
      newUserSection = await UserSection.create({ userSection: userSection });
    } catch (error) {
      // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: -61,
          message: 'Duplicate UserSection name'
        });
      }
    }

    if (!newUserSection) {
      return res.status(404).json({
        code: -6,
        message: 'Error When Adding The UserSection'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'UserSection Added Successfully',
      data: newUserSection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al añadir la sección'
    });
  }
};

// export const updateUserSection = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     // Si hay errores de validación, responde con un estado 400 Bad Request
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { user_id } = req.params;
//     const { userSectionName } = req.body;

//     // Buscar un usuario por su ID en la base de datos
//     const userSection = await UserSection.findByPk(id);
//     if (!userSection) {
//       return res.status(404).json({
//         code: -3,
//         message: 'UserSection no encontrado'
//       });
//     }

//     // Actualizar el correo electrónico y la contraseña del usuario
//     userSection.userSection = userSectionName;
    
//     await userSection.save();

//     // Enviar una respuesta al cliente
//     res.status(200).json({
//       code: 1,
//       message: 'UserSection Updated Successfully',
//       data: userSection
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       code: -100,
//       message: 'Ha ocurrido un error al actualizar la sección'
//     });
//   }
// };

// export const deleteUserSection = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     // Si hay errores de validación, responde con un estado 400 Bad Request
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { id } = req.params;

//     // Buscar una sección por su ID en la base de datos y eliminarlo
//     const deletedUserSection = await UserSection.destroy({ where: { id_UserSection: id } });

//     // Verificar si la sección fue encontrado y eliminado
//     if (!deletedUserSection) {
//       return res.status(404).json({
//         code: -100,
//         message: 'UserSection Not Found'
//       });
//      }
 
//     // Enviar una respuesta al cliente
//     res.status(200).json({
//       code: 1,
//       message: 'UserSection Deleted Successfully'
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       code: -100,
//       message: 'Ha ocurrido un error al eliminar la sección'
//     });
//   }
// };