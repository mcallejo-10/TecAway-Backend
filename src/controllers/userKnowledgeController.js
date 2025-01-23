import { validationResult } from "express-validator";
import UserKnowledge from "../models/userKnowledgeModel.js";
import Knowledge from "../models/knowledgeModel.js";

export const getAllUserKnowledges = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userKnowledges = await UserKnowledge.findAll();

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

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id_user;
    // Buscar un usuario por su ID en la base de datos
    const userKnowledge = await UserKnowledge.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Knowledge,
          attributes: ["knowledge"],
        },
      ],
    });

    if (!userKnowledge) {
      return res.status(404).json({
        code: -6,
        message: "Competencia del usuario no encontrada",
      });
    }
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

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const knowledge = {
      user_id: req.user.id_user,
      knowledge_id: req.body.knowledge_id,
    };

    let newUserKnowledge;
    try {
      const existingUserKnowledge = await UserKnowledge.findOne({
        where: knowledge,
      });

      if (existingUserKnowledge) {
        return res.status(400).json({
          code: -2,
          message: "Ya existe un esta competencia para este usuario",
        });
      }
      newUserKnowledge = await UserKnowledge.create(knowledge);
    } catch (error) {
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

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const knowledge = {
      user_id: req.user.id_user,
      knowledge_id: req.body.knowledge_id,
    };

    const deletedUserKnowledge = await UserKnowledge.destroy({
      where: knowledge,
    });

    if (!deletedUserKnowledge) {
      return res.status(400).json({
        code: -100,
        message: "No existe un este conocimiento para este usuario",
      });
    }
    res.status(200).json({
      code: 1,
      message: "UserKnowledge Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al eliminar el comocimiento del usuario",
    });
  }
};
