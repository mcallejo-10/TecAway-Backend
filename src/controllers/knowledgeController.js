import Knowledge from '../models/knowledgeModel.js';
import { validationResult } from 'express-validator';

export const getKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const knowledge = await Knowledge.findAll();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Knowledge List',
      data: knowledge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener los concimientos',
    });
  }
};

export const getKnowledgeById = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const knowledge = await Knowledge.findByPk(id);
    if (!knowledge) {
      return res.status(404).json({
        code: -6,
        message: 'Conocimiento no encontrado'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Knowledge Detail',
      data: knowledge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener conocimiento'
    });
  }
};

export const addKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { knowledge} = req.body;
    let newKnowledge;
    try {
      newKnowledge = await Knowledge.create({ knowledge: knowledge });
    } catch (error) {
      // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: -61,
          message: 'Duplicate Knowledge name'
        });
      }
    }

    if (!newKnowledge) {
      return res.status(404).json({
        code: -6,
        message: 'Error When Adding The knowledge'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Knowledge Added Successfully',
      data: newKnowledge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al añadir el conocimiento'
    });
  }
};

export const updateKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const knowledgeName = req.body.knowledge;

    // Buscar un usuario por su ID en la base de datos
    const knowledge = await Knowledge.findByPk(id);

    if (!knowledge) {
      return res.status(404).json({
        code: -3,
        message: 'Knowledge no encontrado'
      });
    }

    // Actualizar el correo electrónico y la contraseña del usuario
    knowledge.knowledge = knowledgeName;
    
    await knowledge.save();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Knowledge Updated Successfully',
      data: knowledge
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el conocimiento'
    });
  }
};

export const deleteKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un libro por su ID en la base de datos y eliminarlo
    const deletedKnowledge = await Knowledge.destroy({ where: { id_knowledge: id } });

    // Verificar si el libro fue encontrado y eliminado
    if (!deletedKnowledge) {
      return res.status(404).json({
        code: -100,
        message: 'Knowledge Not Found'
      });
     }
 
    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Knowledge Deleted Successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al eliminar el conocimiento'
    });
  }
};