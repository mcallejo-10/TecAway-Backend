import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import RecoveryToken from '../models/recoveryTokenModel.js';
import sendEmail from "../utils/email/sendEmail.js";
import { validationResult } from 'express-validator';
import { serialize} from "cookie"


// Creación de funciones personalizadas
import { esPar, contraseniasCoinciden } from '../utils/utils.js';
import { log } from 'console';

const clietURL = process.env.CLIENT_URL;
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 60 * 60 * 24 * 30 * 1000, // 30 días en milisegundos
  path: '/',
  domain: '.railway.app'
};

export const register = async (req, res) => {
  try {

    const errors = validationResult(req);
    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    const { email, password, name, title, description, town, can_move, roles } = req.body;
    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(400).json({
        code: -2,
        message: 'Ya existe un usuario con el mismo correo electrónico'
      });
    }
    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const newUser = new User({ email, password: hashedPassword, name, title, description, town, can_move, roles, status: 1 });
  
    await newUser.save();
    

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: newUser.id_user, name: newUser.name }, process.env.JWT_SECRET);
    const token = serialize('token', accessToken, cookieOptions);
    res.setHeader('Set-Cookie', token);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Usuario registrado correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al registrar el usuario',
      error: error,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Si llegamos aquí es porque el middleware de autenticación pasó
    res.status(200).json({
      authenticated: true,
      user: {
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      code: -1,
      message: 'No autenticado'
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);
    

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: -25,
        message: 'user No exist'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: -5,
        message: 'Credenciales incorrectas'
      });
    }
    
    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: user.id_user, name: user.name }, process.env.JWT_SECRET);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    // const token = serialize('token', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 24 * 30,
    //   path: '/',
    // });

    
    // Usar en login, register y changePassword:
    const token = serialize('token', accessToken, cookieOptions);
    res.setHeader('Set-Cookie', token);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Login OK',
      data: {
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email
        } 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al iniciar sesión',
      error: error
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        code: -8,
        message: 'Email does not exist'
      });
    }

    let resetToken = crypto.randomBytes(32).toString("hex");

    await new RecoveryToken({
      user_id: user.id_user,
      token: resetToken,
      created_at: Date.now(),
    }).save();

    const link = `${clietURL}/change-password?token=${resetToken}&id=${user.id_user}`;
    console.log('----resetToken:-----------', resetToken);

    await sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: link,
      },"/email/template/requestResetPassword.handlebars"
      
    ).then(response => {
      console.log("Resultado del envío del correo:", response);
      res.status(200).json({
        code: 100,
        message: 'Send Email OK',
        data: {
          token: resetToken,
          link: link
        }
      });

    },error => {
      console.error (error)
      res.status(200).json({
        code: -80,
        message: 'Send Email KO',
        data: {error}
      });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el usuario',
      error: error
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    //Reviso si el Token existe
    let token_row = await RecoveryToken.findOne({ where: { token } });
    if (!token_row) {
      return res.status(404).json({
        code: -3,
        message: 'Token Incorrecto'
      });
    } 

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({ where: { id_user: token_row.user_id } });
    if (!user) {
      return res.status(404).json({
        code: -10,
        message: 'Usuario no encontrado'
      });
    }


    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await user.save();
    //Elimino el token
    await RecoveryToken.destroy({
      where: {
        user_id: token_row.user_id
      }
    })

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: user.id_user, name: user.name }, process.env.JWT_SECRET);
    const token_jwt = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      
    });
    res.setHeader('Set-Cookie', token_jwt);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'User Detail',
      data: {
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email
        } 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el usuario',
      error: error
    });
  }
};



export const logout = async (req, res) => {
  try {
    // Borrar la cookie sin especificar dominio
    // const token = serialize('token', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',  // Cambiado a 'lax' para permitir cross-domain
    //   maxAge: 0,
    //   path: '/'
    // });
    const token = serialize('token', cookieOptions);
    res.setHeader('Set-Cookie', token);
    
    // Asegurar que los headers CORS están correctamente configurados
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

// export const logout = async (req, res) => {

//   const { cookies } = req;
//   const jwt = cookies.token;

//   const token = serialize('token', null, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'strict',
//     maxAge: -1,
//     path: '/',
//     domain: '.railway.app'
//   });
//   res.setHeader('Set-Cookie', token);
//   res.status(200).json({
//     code: 0,
//     message: 'Logged out - Delete Token',
//   });
// }