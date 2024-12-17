import { validationResult } from "express-validator";
import UserKnowledge from "../models/userKnowledgeModel.js";


export const getUserKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const userKnowledges = await UserKnowledge.findAll();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: "UserKnowledges List",
      data: userKnowledges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al obtener las secciones del usuario",
    });
  }
};

export const getUserKnowledgeById = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const userId = req.params.id;
      // Buscar un usuario por su ID en la base de datos
      const userKnowledge = await UserKnowledge.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Knowledge,
            attributes: ["Knowledge"],
          },
        ],
      });
  
      if (!userKnowledge) {
        return res.status(404).json({
          code: -6,
          message: "Competencia del usuario no encontrada",
        });
      }
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: "UserKnowledge Detail",
        data: userKnowledge,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al obtener competencias del usuario",
      });
    }
  };
  
  export const addUserKnowledge = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { user_id, Knowledge_id } = req.body;
  
      let newUserKnowledge;
      try {
        const existingUserKnowledge = await UserKnowledge.findOne({
          where: { user_id, Knowledge_id },
        });
  
        if (existingUserKnowledge) {
          return res.status(400).json({
            code: -2,
            message: "Ya existe un esta competencia para este usuario",
          });
        }
        newUserKnowledge = await UserKnowledge.create({ user_id, Knowledge_id });
      } catch (error) {
        // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
        if (error.name === "SequelizeUniqueConstraintError") {
          res.status(400).json({
            code: -61,
            message: "Duplicate UserKnowledge name",
          });
        }
      }
  
      if (!newUserKnowledge) {
        return res.status(404).json({
          code: -6,
          message: "Error When Adding The UserKnowledge",
        });
      }
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: "UserKnowledge Added Successfully",
        data: newUserKnowledge,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al añadir el conocimiento del usuario",
      });
    }
  };
  
  export const deleteUserKnowledge = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { user_id, Knowledge_id } = req.body;
  
      const deletedUserKnowledge = await UserKnowledge.destroy({
        where: { user_id, Knowledge_id },
      });
  
      if (!deletedUserKnowledge) {
        return res.status(400).json({
          code: -100,
          message: "No existe un este conocimiento para este usuario",
        });
      }
          // Enviar una respuesta al cliente
          res.status(200).json({
            code: 1,
            message: 'UserKnowledge Deleted Successfully'
          });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al eliminar el comocimiento del usuario",
      });
    }
  };
  