import GeneralCompetence from '../models/generalCompetenceModel.js';
import { validationResult } from 'express-validator';

export const getGeneralCompetences = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const generalCompetece = await GeneralCompetence.findAll();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'GeneralCompetence List',
      data: generalCompetece
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener los concimientos',
    });
  }
};


export const getGeneralCompetenceById = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const generalCompetece = await GeneralCompetence.findByPk(id);
    if (!generalCompetece) {
      return res.status(404).json({
        code: -6,
        message: 'Conocimiento no encontrado'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'GeneralCompetence Detail',
      data: generalCompetece
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener conocimiento'
    });
  }
};

export const addGeneralCompetence = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { generalCompetence } = req.body;
    let newGeneralCompetence;
    try {
      newGeneralCompetence = await GeneralCompetence.create({ generalCompetence: generalCompetence });
    } catch (error) {
      // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: -61,
          message: 'Duplicate GeneralCompetence name'
        });
      }
    }

    if (!newGeneralCompetence) {
      return res.status(404).json({
        code: -6,
        message: 'Error When Adding The generalCompetece'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'GeneralCompetence Added Successfully',
      data: newGeneralCompetence
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al añadir el conocimiento'
    });
  }
};

export const updateGeneralCompetence = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const generalCompetenceName = req.body.generalCompetence;

    // Buscar un usuario por su ID en la base de datos
    const generalCompetence = await GeneralCompetence.findByPk(id);

    if (!generalCompetence) {
      return res.status(404).json({
        code: -3,
        message: 'GeneralCompetence no encontrado'
      });
    }

    // Actualizar el correo electrónico y la contraseña del usuario
    generalCompetence.generalCompetence = generalCompetenceName;
    
    await generalCompetence.save();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'GeneralCompetence Updated Successfully',
      data: generalCompetence
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el conocimiento'
    });
  }
};

export const deleteGeneralCompetence = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un libro por su ID en la base de datos y eliminarlo
    const deletedGeneralCompetence = await GeneralCompetence.destroy({ where: { id_generalCompetence: id } });

    // Verificar si el libro fue encontrado y eliminado
    if (!deletedGeneralCompetence) {
      return res.status(404).json({
        code: -100,
        message: 'GeneralCompetence Not Found'
      });
     }
 
    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'GeneralCompetence Deleted Successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al eliminar el conocimiento'
    });
  }
};