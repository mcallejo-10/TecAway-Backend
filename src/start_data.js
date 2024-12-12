import User from "./models/userModel.js";
import Section from "./models/sectionModel.js";
import Knowledge from "./models/knowledgeModel.js";
import UserSection from "./models/userSectionModel.js";
import GeneralCompetence from "./models/generalCompetenceModel.js";

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
      title: "Ha de ser un titulo entre 30 y 130 caracteresm",      
      description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd",
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
    { knowledge: "Mecánica"},
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

      

  ]
  const userSectionData = [
    { user_id: 1, section_id: 238 },
    { user_id: 1, section_id: 239 },
    { user_id: 2, section_id: 243 },
    { user_id: 2, section_id: 240 },
    { user_id: 3, section_id: 238 },
    { user_id: 3, section_id: 245 },
    { user_id: 4, section_id: 238 },
    { user_id: 4, section_id: 243 },
    { user_id: 5, section_id: 238 },
  ];

  const generalCompeteceData = [
    { generalCompetence: "Qlab"},
    { generalCompetence: "Carnet de conducir B"},
    { generalCompetence: "Carnet de conducir C"},
    { generalCompetence: "PRL"},
    { generalCompetence: "Trabajo en altura"},
    { generalCompetence: "Trabajo en plataformas elevadoras"},

  ];

  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await UserSection.bulkCreate(userSectionData, { ignoreDuplicates: true });
  await User.bulkCreate(userData, { ignoreDuplicates: true });
  await Knowledge.bulkCreate(knowledgeData, { ignoreDuplicates: true });
  await Section.bulkCreate(sectionData, { ignoreDuplicates: true });
  await GeneralCompetence.bulkCreate(generalCompeteceData, { ignoreDuplicates: true });
};

export { insertInitialUserData };
