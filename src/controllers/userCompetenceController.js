import UserCompetence from '../models/userCompetenceModel.js';
import { validationResult } from "express-validator";

export const getUserCompetences = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const userCompetences = await UserCompetence.findAll();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: "UserCompetences List",
      data: userCompetences,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al obtener las secciones del usuario",
    });
  }
};

export const getUserCompetenceById = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const userId = req.params.id;
      // Buscar un usuario por su ID en la base de datos
      const userCompetence = await UserCompetence.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Competence,
            attributes: ["Competence"],
          },
        ],
      });
  
      if (!userCompetence) {
        return res.status(404).json({
          code: -6,
          message: "Competencia del usuario no encontrada",
        });
      }
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: "UserCompetence Detail",
        data: userCompetence,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al obtener competencias del usuario",
      });
    }
  };
  
  export const addUserCompetence = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { user_id, competence_id } = req.body;
  
      let newUserCompetence;
      try {
        const existingUserCompetence = await UserCompetence.findOne({
          where: { user_id, competence_id },
        });
  
        if (existingUserCompetence) {
          return res.status(400).json({
            code: -2,
            message: "Ya existe un esta competencia para este usuario",
          });
        }
        newUserCompetence = await UserCompetence.create({ user_id, competence_id });
      } catch (error) {
        // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
        if (error.name === "SequelizeUniqueConstraintError") {
          res.status(400).json({
            code: -61,
            message: "Duplicate UserCompetence name",
          });
        }
      }
  
      if (!newUserCompetence) {
        return res.status(404).json({
          code: -6,
          message: "Error When Adding The UserCompetence",
        });
      }
  
      // Enviar una respuesta al cliente
      res.status(200).json({
        code: 1,
        message: "UserCompetence Added Successfully",
        data: newUserCompetence,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al añadir la competencia",
      });
    }
  };
  
  export const deleteUserCompetence = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      // Si hay errores de validación, responde con un estado 400 Bad Request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { user_id, competence_id } = req.body;
  
      const deletedUserCompetence = await UserCompetence.destroy({
        where: { user_id, competence_id },
      });
  
      if (!deletedUserCompetence) {
        return res.status(400).json({
          code: -100,
          message: "No existe un esta competencia para este usuario",
        });
      }
          // Enviar una respuesta al cliente
          res.status(200).json({
            code: 1,
            message: 'UserCompetence Deleted Successfully'
          });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: "Ha ocurrido un error al eliminar la competencia del usuario",
      });
    }
  };
  