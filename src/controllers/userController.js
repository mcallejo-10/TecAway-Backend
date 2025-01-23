import e from "express";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { uploadToCloudinary, getOptimizedUrl, getTransformedUrl } from "../utils/cloudinaryService.js";
import { sequelize } from "../db.js"; 

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
      town: req.user.town,
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
      town: user.town,
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

    const { name, email, title, description, town, can_move } = req.body;
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
      await user.update({ name, email, title, description, town, can_move });
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

    const results = await sequelize.query(
      `
      SELECT 
        u.id_user AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.title AS user_title,
        u.description AS user_description,
        u.town AS user_town,
        u.can_move AS user_can_move,
        u.photo AS user_photo,
        s.id_section AS section_id,
        s.section AS section_name,
        k.id_knowledge AS knowledge_id,
        k.knowledge AS knowledge_name
      FROM Users u
      INNER JOIN User_Knowledges uk ON u.id_user = uk.user_id
      INNER JOIN Knowledge k ON uk.knowledge_id = k.id_knowledge
      INNER JOIN Sections s ON k.section_id = s.id_section
      WHERE u.id_user = :id
      `,
      {
        replacements: { id }, 
        type: sequelize.QueryTypes.SELECT, 
      }
    );

    if (results.length === 0) {
      return res.status(404).json({
        code: -6,
        message:
          "No se encontraron secciones ni conocimientos para este usuario",
      });
    }

    const formattedData = {
      id: results[0].user_id,
      name: results[0].user_name,
      email: results[0].user_email,
      title: results[0].user_title,
      description: results[0].user_description,
      town: results[0].user_town,
      can_move: results[0].user_can_move,
      photo: results[0].user_photo,
      sections: [],
    };

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

    res.status(200).json({
      code: 1,
      message: "Secciones y conocimientos del usuario obtenidos correctamente",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ocurrió un error al obtener las secciones y conocimientos",
    });
  }
};




export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: -101, message: 'Please upload a file!' });
    }

    const publicId = `user_${req.user.id_user}_${Date.now()}`;
    
    const uploadResult = await uploadToCloudinary(req.file.buffer, publicId);

    const optimizedUrl = getOptimizedUrl(uploadResult.public_id);
    const transformedUrl = getTransformedUrl(uploadResult.public_id);

    await User.update(
      { photo: uploadResult.secure_url },
      { where: { id_user: req.user.id_user } }
    );

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
    res.status(500).json({
      code: -100,
      message: 'Error uploading file',
      error: error.message
    });
  }
};