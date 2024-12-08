import User from "./models/userModel.js";
import Section from "./models/sectionModel.js";

const insertInitialUserData = async () => {
  const userData = [
    {
      email: "ismael.academy@gmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Ismael",
      cp: 8023,
      distance: 1000,
      roles: ["user"],
    },
    {
      email: "laura@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Laura",
      cp: 8023,
      distance: 1000,
      roles: ["user"],
    },
    {
      email: "maria@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Maria",
      surname: "kale",
      cp: 8023,
      distance: 1000,
      roles: ["mod", "admin"],
    },
    {
      email: "mod@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Moderador",
      surname: "kale",
      cp: 8023,
      distance: 1000,
      roles: ["admin"],
    },
    {
      email: "admin@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Admin",
      surname: "kale",
      cp: 8023,
      distance: 1000,
      roles: ["admin"],
    },
  ];

  const sectionData = [
    { section: "iluminacion" },
    { section: "video" },
    { section: "sonido" },
    { section: "regiduria" },
    { section: "escenografia" },
    { section: "maquinaria" },
    { section: "vestuario" },
    { section: "caracterizacion" },
    { section: "produccion" },
  ];
  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await User.bulkCreate(userData, { ignoreDuplicates: true });
  // Insertar datos con opción ignoreDuplicates
  await Section.bulkCreate(sectionData, { ignoreDuplicates: true });
};

export { insertInitialUserData };
