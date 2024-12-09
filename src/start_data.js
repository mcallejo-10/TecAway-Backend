import User from "./models/userModel.js";
import Section from "./models/sectionModel.js";
import Knowledge from "./models/knowledgeModel.js";
import UserSection from "./models/userSectionModel.js";

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

  const knowledgeData = [
    // siatemas de iluminacion
    { knowledge: "LT"},
    { knowledge: "Avolites"},
    { knowledge: "GrandMA"},
    { knowledge: "Chamsys"},
    { knowledge: "Hog"},
    { knowledge: "ETC"},
    { knowledge: "Robe"},
    { knowledge: "Q::light"},
    { knowledge: "Dlight"},
    // sistemas de sonido
    { knowledge: "Midas"},
    { knowledge: "Digico"},
    { knowledge: "Yamaha"},
    { knowledge: "Soundcraft"},
    { knowledge: "Allen&Heath"},
    { knowledge: "Tascam"},
    { knowledge: "Waves"},
    { knowledge: "Protools"},
    // video
    { knowledge: "Resolume"},
    { knowledge: "Madmapper"},
    { knowledge: "Watchout"},
    { knowledge: "Pandora"},
    { knowledge: "VDMX"},
    { knowledge: "Modul8"},
    { knowledge: "Millumin"},
    { knowledge: "Arkaos"},
    { knowledge: "TouchDesigner"},
    // regiduria
    { knowledge: "StageManager"},
    { knowledge: "Asistente de direccion"},
    // escenografia
    { knowledge: "Carpinteria"},
    { knowledge: "Pintura"},
    { knowledge: "Escultura"},
    { knowledge: "Decoracion"},
    { knowledge: "Atrezzo"},
    // maquinaria
    { knowledge: "Motores"},
    { knowledge: "Polipastos"},
    { knowledge: "Truss"},
    { knowledge: "Estructuras"},
    { knowledge: "Mecanica"},
    // vestuario
    { knowledge: "Patronaje"},
    { knowledge: "Confeccion"},
    { knowledge: "Sastreria"},
    { knowledge: "Estilismo"},
    { knowledge: "Vestuario"},
    // caracterizacion
    { knowledge: "Maquillaje"},
    { knowledge: "Peluqueria"},
    { knowledge: "FX"},
    { knowledge: "Protesis"},
    { knowledge: "Caracterizacion"},
    //otros
    { knowledge: "Qlab"},

    { konwledge: "Carnet de conducir B"},
    { konwledge: "Carnet de conducir C"},

    { konwledge: "PRL"},
    { konwledge: "Trabajo en altura"},
    { konwledge: "Trabajo en plataformas elevadoras"},
      

  ]
  const userSectionData = [
    { user_id: 1, section_id: 1 },
    { user_id: 1, section_id: 2 },
    { user_id: 2, section_id: 3 },
    { user_id: 2, section_id: 2 },
    { user_id: 3, section_id: 5 },
    { user_id: 3, section_id: 6 },
    { user_id: 4, section_id: 7 },
    { user_id: 4, section_id: 8 },
    { user_id: 5, section_id: 9 },
  ];


  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await User.bulkCreate(userData, { ignoreDuplicates: true });
  await Knowledge.bulkCreate(knowledgeData, { ignoreDuplicates: true });
  await Section.bulkCreate(sectionData, { ignoreDuplicates: true });
  await UserSection.bulkCreate(userSectionData, { ignoreDuplicates: true });
};

export { insertInitialUserData };
