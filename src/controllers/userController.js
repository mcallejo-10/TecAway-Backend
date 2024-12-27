import e from "express";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import fs from "fs";

//https://www.bezkoder.com/node-js-express-file-upload/

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

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Obtener todos los usuarios de la base de datos
    const users = await User.findAll();

    // Enviar una respuesta al cliente
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

export const getUser = async (req, res) => {
  try {
    const user_data = {
      id_user: req.user.id_user,
      email: req.user.email,
      password: req.user.password,
      name: req.user.name,
      title: req.user.title,
      description: req.user.description,
      cp: req.user.cp,
      distance: req.user.distance,
      photo: req.user.photo,
      roles: req.user.roles,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    };

    // Enviar una respuesta al cliente
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

export const uploadPhoto = async (req, res) => {
  try {
    const rutaArchivo = "./src/uploads/"; // Ruta completa al archivo que deseas eliminar
    //await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).json({
        code: -101,
        message: "Please upload a file!",
      });
    }

    //Si el usuario tiene foto, se la eliminamos
    if (req.user.photo != null) {
      console.log("Ruta:" + rutaArchivo + req.user.photo);
      fs.access(rutaArchivo + req.user.photo, fs.constants.F_OK, (err) => {
        if (err) {
          console.log("The file does not exist or cannot be accessed");
          /*res.status(400).json({
            code: -102,
            message: 'The file does not exist or cannot be accessed',
            error: err
          });*/
        } else {
          // Eliminar el archivo
          fs.unlink(rutaArchivo + req.user.photo, (err) => {
            if (err) {
              console.error("Error al eliminar el archivo", err);
              return res.status(500).json({
                code: -103,
                message: "Error deleting file",
                error: err,
              });
            }
            console.log("El archivo ha sido eliminado correctamente.");
          });
        }
      });
    } else console.log("El usuario no tiene foto, la seteo en la DB");

    //Actualizo la imagen del usuario
    console.log(
      "Guardo la imagen: " +
        req.file.filename +
        " en el id de usuario: " +
        req.user.id_user
    );
    await User.update(
      { photo: req.file.filename },
      { where: { id_user: req.user.id_user } }
    );
    return res.status(200).json({
      code: 1,
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      error: `${err}`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.user.id_user;

    const { name, email, title, description, cp, distance } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.email != req.user.email) {
      return res.status(400).json({
        code: -2,
        message: "Ya existe un usuario con el mismo correo electrónico",
      });
    }
    // Buscar un usuario por su ID en la base de datos
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        code: -3,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar datos del usuario: nombre, email, título y descripción
    try {
      await user.update({ name, email, title, description, cp, distance });
    } catch (error) {
      // Si hay un error de duplicación de clave única (por ejemplo, título duplicado)
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({
          code: -61,
          message: "This email already exists",
        });
      }
    }

    // Enviar una respuesta al cliente
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
