
import Section from '../models/sectionModel.js';
import { validationResult } from 'express-validator';

export const getSections = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const sections = await Section.findAll();


    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Sections List',
      data: sections
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener las secciones',
    });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        code: -6,
        message: 'Sección no encontrada'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Section Detail',
      data: section
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al obtener sección'
    });
  }
};

export const addSection = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log('++++++++++++++++++++++++++++++', errors);
    

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { section} = req.body;
    let newSection;
    try {
      newSection = await Section.create({ section: section });
    } catch (error) {
      // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: -61,
          message: 'Duplicate Section name'
        });
      }
    }

    if (!newSection) {
      return res.status(404).json({
        code: -6,
        message: 'Error When Adding The Section'
      });
    }

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Section Added Successfully',
      data: newSection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al añadir la sección'
    });
  }
};



export const updateSection = async (req, res) => {
  try {
    const errors = validationResult(req);
      // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const sectionName = req.body.section;
    
    
   // Buscar un usuario por su ID en la base de datos
    const section = await Section.findByPk(id);
    
    if (!section) {
      return res.status(404).json({
        code: -3,
        message: 'Section no encontrado'
      });
    }

    // Actualizar el correo electrónico y la contraseña del usuario
    section.section = sectionName;   
    await section.save();

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Section Updated Successfully',
      data: section
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar la sección'
    });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log('++++++++++++++++++++++++++++++', errors);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Buscar una sección por su ID en la base de datos y eliminarlo
    const deletedSection = await Section.destroy({ where: { id_section: id } });

    // Verificar si la sección fue encontrado y eliminado
    if (!deletedSection) {
      return res.status(404).json({
        code: -100,
        message: 'Section Not Found'
      });
     }
 
    
    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Section Deleted Successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al eliminar la sección'
    });
  }
};