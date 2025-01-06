import User from "./models/userModel.js";
import Section from "./models/sectionModel.js";
import Knowledge from "./models/knowledgeModel.js";
import UserKnowledge from "./models/userKnowledgeModel.js";

const insertInitialUserData = async () => {
  const userData = [
    {
      email: "ismael.academy@gmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Ismael",
      title: "Ha de ser un titulo entre 30 y 130 caracteresm",
      description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd",
      town: "Barcelona",
      can_move: true,
      roles: ["user"],
    },
    {
      email: "laura@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Laura",
      title: "Ha de ser un titulo entre 30 y 130 caracteresm",
      description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd",
      town: "Barcelona",
      can_move: false,
      roles: ["user"],
    },
    {
      email: "maria@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Maria",
      title: "Ha de ser un titulo entre 30 y 130 caracteresm",
      description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd",
      town: "Barcelona",
      can_move: true,
      roles: ["mod", "admin"],
    },
    {
      email: "mod@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Moderador",
      title: "Ha de ser un titulo entre 30 y 130 caracteresm",
      description: "Aquí un texto de ejemplo: lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc  lorem i skjd",
      town: "Madrid",
      can_move: true,
      roles: ["admin"],
    },

    {
      email: "admin@hotmail.com",
      password: "$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q", //pass: ismael123
      name: "Admin",
      surname: "kale",
      town: "Barcelona",
      can_move: false,
      roles: ["admin"],
    },
  ];

  const sectionData = [
    { section: "Iluminacion" },
    { section: "Video" },
    { section: "Sonido" },
    { section: "Regiduria" },
    { section: "Escenografia" },
    { section: "Maquinaria" },
    { section: "Vestuario" },
    { section: "Caracterizacion" },
    { section: "Produccion" },
    { section: "General" },
  ];

  const knowledgeData = [
    // siatemas de iluminacion
    {
      knowledge: "Iluminación",
      section_id: 1
    },
    {
      knowledge: "LT",
      section_id: 1
    },
    {
      knowledge: "ETC",
      section_id: 1
    },
    {
      knowledge: "Avolites",
      section_id: 1
    },
    {
      knowledge: "GrandMA",
      section_id: 1
    },
    {
      knowledge: "Chamsys",
      section_id: 1
    },
    {
      knowledge: "Hog",
      section_id: 1
    },
    {
      knowledge: "Q::light",
      section_id: 1
    },
    {
      knowledge: "Robe",
      section_id: 1
    },
    {
      knowledge: "Dlight",
      section_id: 1
    },

    // video
    {
      knowledge: "Video",
      section_id: 2
    },
    {
      knowledge: "Resolume",
      section_id: 2
    },
    {
      knowledge: "Madmapper",
      section_id: 2
    },
    {
      knowledge: "Watchout",
      section_id: 2
    },
    {
      knowledge: "Pandora",
      section_id: 2
    },
    {
      knowledge: "VDMX",
      section_id: 2
    },
    {
      knowledge: "Modul8",
      section_id: 2
    },
    {
      knowledge: "Millumin",
      section_id: 2
    },
    {
      knowledge: "Arkaos",
      section_id: 2
    },
    {
      knowledge: "TouchDesigner",
      section_id: 2
    },


    // sistemas de sonido
    {
      knowledge: "Sonido",
      section_id: 3
    },
    {
      knowledge: "Midas",
      section_id: 3
    },
    {
      knowledge: "Digico",
      section_id: 3
    },
    {
      knowledge: "Yamaha",
      section_id: 3
    },
    {
      knowledge: "Soundcraft",
      section_id: 3
    },
    {
      knowledge: "Allen&Heath",
      section_id: 3
    },
    {
      knowledge: "Tascam",
      section_id: 3
    },
    {
      knowledge: "Waves",
      section_id: 3
    },
    {
      knowledge: "Protools",
      section_id: 3
    },
    {
      knowledge: "Logic",
      section_id: 3
    },



    // regiduria 4
    {
      knowledge: "Regiduria",
      section_id: 4
    },
    {
      knowledge: "StageManager",
      section_id: 4
    },
    {
      knowledge: "Ayudante de regiduria",
      section_id: 4
    },
    {
      knowledge: "Regidor",
      section_id: 4
    },
    {
      knowledge: "Stage Manager",
      section_id: 4
    },
    {
      knowledge: "Regidor de escena",
      section_id: 4
    },
    {
      knowledge: "Regidor de platós",
      section_id: 4
    },

    // escenografia 5
    {
      Knowledge: "Escenografia",
      section_id: 5
    },
    {
      knowledge: "Carpinteria",
      section_id: 5
    },
    {
      knowledge: "Pintura",
      section_id: 5
    },
    {
      knowledge: "Escultura",
      section_id: 5
    },
    {
      knowledge: "Decoracion",
      section_id: 5
    },
    {
      knowledge: "Atrezzo",
      section_id: 5
    },
    {
      knowledge: "Moldes",
      section_id: 5
    },
    {
      knowledge: "Tapiceria",
      section_id: 5
    },
    {
      knowledge: "Veladuras",
      section_id: 5
    },

    {
      knowledge: "Efcetos especiales",
      section_id: 5
    },

    // maquinaria
    {
      knowledge: "Maquinaria",
      section_id: 6
    },
    {
      knowledge: "Motores",
      section_id: 6
    },
    {
      knowledge: "Mesa de motores Control-x",
      section_id: 6
    },
    {
      knowledge: "Mesa de motores Kinesys",
      section_id: 6
    },
    {
      knowledge: "Polipastos",
      section_id: 6
    },
    {
      knowledge: "Truss",
      section_id: 6
    },
    {
      knowledge: "Estructuras",
      section_id: 6
    },
    {
      knowledge: "Mecánica",
      section_id: 6
    },
    {
      knowledge: "Autocat",
      section_id: 6
    },
    {
      knowledge: "Soldadura",
      section_id: 6
    },
    {
      knowledge: "Montaje de contrapesadas",
      section_id: 6
    },
    {
      knowledge: "Montaje de Americanas",
      section_id: 6
    },

    // vestuario
    { knowledge: "Vestuario",
      section_id: 7
     },
    { knowledge: "Patronaje",
      section_id: 7
     },
    { knowledge: "Confeccion",
      section_id: 7
     },
    { knowledge: "Sastreria",
      section_id: 7
     },
    { knowledge: "Estilismo",
      section_id: 7
     },
    { knowledge: "Vestuario",
      section_id: 7
     },
    // caracterizacion
    {
      knowledge: "Caracterizacion",
      section_id: 8
    },
    { knowledge: "Maquillaje",
      section_id: 8
    },
    { knowledge: "Peluqueria",
      section_id: 8
    },
    { knowledge: "FX",
      section_id: 8
    },
    { knowledge: "Protesis",
      section_id: 8
    },
    { knowledge: "Caracterizacion",
      section_id: 8
    },

    // produccion 9
    { knowledge: "Produccion",
      section_id: 9
    },

    //general 10
    { knowledge: "PRL" ,
      section_id: 10
    },

    { knowledge: "Trabajo en altura",
      section_id: 10
     },
    { knowledge: "Trabajo en plataformas elevadoras",
      section_id: 10
     },
    { knowledge: "Carnet de conducir B",
      section_id: 10
     },
    { knowledge: "Carnet de conducir C",
      section_id: 10
     },
    { knowledge: "Qlab",
      section_id: 10
     },
    { knowledge: "Carnet de carretillero",
      section_id: 10
     },

  ];

  const userKnowledgeData = [
    { user_id: 1, knowledge_id: 1 },
    { user_id: 1, knowledge_id: 2 },
    { user_id: 2, knowledge_id: 13 },
    { user_id: 2, knowledge_id: 1 },
    { user_id: 3, knowledge_id: 1 },
    { user_id: 3, knowledge_id: 31 },
    { user_id: 4, knowledge_id: 4 },
    { user_id: 4, knowledge_id: 33 },
    { user_id: 5, knowledge_id: 8 },
  ];



  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await User.bulkCreate(userData, { ignoreDuplicates: true });
  await Section.bulkCreate(sectionData, { ignoreDuplicates: true });
  await Knowledge.bulkCreate(knowledgeData, { ignoreDuplicates: true });
  await UserKnowledge.bulkCreate(userKnowledgeData, { ignoreDuplicates: true });

};



export { insertInitialUserData };
