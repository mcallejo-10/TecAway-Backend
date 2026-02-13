import e from "express";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { uploadToCloudinary, getOptimizedUrl, getTransformedUrl } from "../utils/cloudinaryService.js";
import { sequelize } from "../db.js"; 
import UserKnowledge from '../models/userKnowledgeModel.js';  // Añadir este import

export const checkEmailExists = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const userExists = await User.findOne({ where: { email } });
    res.json(!!userExists);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "An error occurred while checking the email",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await User.findAll();

    res.status(200).json({
      code: 1,
      message: "users List",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al obtener los usuarios",
    });
  }
};

export const getMyUser = async (req, res) => {
  try {
    const user_data = {
      id_user: req.user.id_user,
      email: req.user.email,
      password: req.user.password,
      name: req.user.name,
      title: req.user.title,
      description: req.user.description,
      city: req.user.city,
      country: req.user.country,
      postal_code: req.user.postal_code,
      can_move: req.user.can_move,
      photo: req.user.photo,
      roles: req.user.roles,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    };

    res.status(200).json({
      code: 1,
      message: "User Detail",
      data: user_data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "An error occurred while obtaining the USER",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID: " + id);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        code: -6,
        message: "Usuario no encontrado",
      });
    }
    const user_data = {
      id_user: id,
      email: user.email,
      password: user.password,
      name: user.name,
      title: user.title,
      description: user.description,
      city: user.city,
      country: user.country,
      postal_code: user.postal_code,
      can_move: user.can_move,
      photo: user.photo,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.status(200).json({
      code: 1,
      message: "User Detail",
      data: user_data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "An error occurred while obtaining the USER",
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.user.id_user;

    const { name, email, title, description, city, can_move } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.email != req.user.email) {
      return res.status(400).json({
        code: -2,
        message: "Ya existe un usuario con el mismo correo electrónico",
      });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        code: -3,
        message: "Usuario no encontrado",
      });
    }
    try {
      await user.update({ name, email, title, description, city, can_move });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({
          code: -61,
          message: "This email already exists",
        });
      }
    }
    res.status(200).json({
      code: 1,
      message: "User Updated Successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al actualizar el usuario",
    });
  }
};

export const getUserSectionsAndKnowledge = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero verificamos si el usuario existe
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        code: -6,
        message: "Usuario no encontrado",
      });
    }

    // Obtenemos los datos del usuario con sus conocimientos y secciones (si los tiene)
    const results = await sequelize.query(
      `
      SELECT 
        u.id_user AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.title AS user_title,
        u.description AS user_description,
        u.city AS user_city,
        u.country AS user_country,
        u.can_move AS user_can_move,
        u.photo AS user_photo,
        s.id_section AS section_id,
        s.section AS section_name,
        k.id_knowledge AS knowledge_id,
        k.knowledge AS knowledge_name
      FROM Users u
      LEFT JOIN User_Knowledges uk ON u.id_user = uk.user_id
      LEFT JOIN Knowledge k ON uk.knowledge_id = k.id_knowledge
      LEFT JOIN Sections s ON k.section_id = s.id_section
      WHERE u.id_user = :id
      `,
      {
        replacements: { id }, 
        type: sequelize.QueryTypes.SELECT, 
      }
    );

    // Formatear los datos básicos del usuario
    const formattedData = {
      id: user.id_user,
      name: user.name,
      email: user.email,
      title: user.title,
      description: user.description,
      city: user.city,
      country: user.country,
      can_move: user.can_move,
      photo: user.photo,
      sections: [],
    };

    // Si el usuario tiene conocimientos, los procesamos
    if (results.length > 0 && results[0].section_id) {
      const sectionsMap = {};

      results.forEach((row) => {
        if (!sectionsMap[row.section_id]) {
          sectionsMap[row.section_id] = {
            section_name: row.section_name,
            section_knowledges: [],
          };
        }

        sectionsMap[row.section_id].section_knowledges.push({
          knowledge_name: row.knowledge_name,
        });
      });

      formattedData.sections = Object.values(sectionsMap);
    }

    res.status(200).json({
      code: 1,
      message: "Información del usuario obtenida correctamente",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ocurrió un error al obtener la información del usuario",
    });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    console.log('=== UPLOAD PHOTO REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('File info:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file received');

    if (!req.file) {
      return res.status(400).json({ 
        code: -101, 
        message: 'No se ha recibido ningún archivo. Por favor, selecciona una imagen.' 
      });
    }

    // Validaciones adicionales para iOS
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        code: -102, 
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.' 
      });
    }

    const publicId = `user_${req.user.id_user}_${Date.now()}`;
    
    const uploadResult = await uploadToCloudinary(req.file.buffer, publicId);

    const optimizedUrl = getOptimizedUrl(uploadResult.public_id);
    const transformedUrl = getTransformedUrl(uploadResult.public_id);

    await User.update(
      { photo: uploadResult.secure_url },
      { where: { id_user: req.user.id_user } }
    );

    console.log('Foto subida exitosamente:', uploadResult.secure_url);

    return res.status(200).json({
      code: 1,
      message: 'File uploaded successfully',
      data: {
        originalUrl: uploadResult.secure_url,
        optimizedUrl,
        transformedUrl
      }
    });
  } catch (error) {
    console.error('Error en la carga de la foto:', error);
    
    // Mejor manejo de errores específicos
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        code: -102,
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.',
        error: error.message
      });
    }
    
    if (error.message && error.message.includes('Tipo de archivo no permitido')) {
      return res.status(400).json({
        code: -103,
        message: 'Tipo de archivo no válido. Solo se permiten imágenes.',
        error: error.message
      });
    }

    res.status(500).json({
      code: -100,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        code: -4,
        message: "Usuario no encontrado",
      });
    }

    // Manual deletion of associated knowledges
    await UserKnowledge.destroy({
      where: { user_id: id }
    });

    await user.destroy();

    res.status(200).json({
      code: 1,
      message: "Usuario y conocimientos asociados eliminados correctamente",
    });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({
      code: -100,
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
};