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

  const knoledgeData = [
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
    { knowledge: "Regidor"},
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
    { userId: 1, sectionId: 1 },
    { userId: 1, sectionId: 2 },
    { userId:2, sectionId: 3 },
    { userId:2, sectionId: 2 },
    { userId:3, sectionId: 5 },
    { userId:3, sectionId: 6 },
    { userId:4, sectionId: 7 },
    { userId:4, sectionId: 8 },
    { userId:5, sectionId: 9 },
  ];


  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await User.bulkCreate(userData, { ignoreDuplicates: true });
  await Knowledge.bulkCreate(knoledgeData, { ignoreDuplicates: true });
  await Section.bulkCreate(sectionData, { ignoreDuplicates: true });
  await UserSection.bulkCreate(userSectionData, { ignoreDuplicates: true });
};

export { insertInitialUserData };
