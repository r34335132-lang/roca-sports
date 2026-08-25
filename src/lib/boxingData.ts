export type BoxingDivision =
  | "Pesado"
  | "Crucero"
  | "Semipesado"
  | "Supermedio"
  | "Medio"
  | "Superwelter"
  | "Welter"
  | "Superligero"
  | "Ligero"
  | "Pluma"
  | "Mosca";

export type BoxingGym = {
  id: string;
  name: string;
  coaches: string[];
  address: string;
  phone: string[];
  city: string;
  region: "capital" | "municipio";
};

export type BoxingFighter = {
  id: string;
  name: string;
  gym: string;
  division: BoxingDivision;
  record: string;
  photo: string;
  trend?: "up" | "down" | "same";
};

export type BoxingBout = {
  id: string;
  dateLabel: string;
  left: { name: string; rank?: number };
  right: { name: string; rank?: number };
  venue: string;
};

const BOXER_PHOTOS = [
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1611676197275-0224b4c2c1b5?auto=format&fit=crop&w=200&h=200&q=80",
];

function gym(
  id: string,
  name: string,
  coaches: string[],
  address: string,
  phones: string[],
  region: "capital" | "municipio" = "capital",
  city = "Durango",
): BoxingGym {
  return { id, name, coaches, address, phone: phones, city, region };
}

/** Directorio oficial de gimnasios de boxeo — Durango capital y municipios. */
export const BOXING_GYMS: BoxingGym[] = [
  gym("g01", "Diamond Gym", ["Roberto Carlos Carrazco Ortega"], "Cto. Interiors #500, Col. Valle del Guadiana C.P. 34166", ["618-189-2403"]),
  gym("g02", "Body Sport", ["Jonathan Castillo"], "Uxmal #102, Fracc. Vista Hermosa del Guadiana", ["618-124-7434"]),
  gym("g03", "Boom", ["Néstor Flores"], "Reforma #704, Col. Porfirio Díaz C.P. 34090", ["618-201-7286"]),
  gym("g04", "Boxe-Fit", ["Juan Daniel Hdez. Salas", "Manuel Medrano"], "Santiago de Chile S/N, Unidad Deportiva, Fracc. Guadalupe", ["618-319-8073", "618-211-6074", "618-299-9187"]),
  gym("g05", "Bueno's Boxing", ["Jesús Eduardo Bueno Torres"], "Lic. Adolfo López Mateos #310, Col. José López Portillo C.P. 34010", ["618-321-7431"]),
  gym("g06", "Cachimbas García", ["Gerardo García"], "Paseo de las Parras #200 esq. De las Hiedras, Col. Valle Verde C.P. 34194", ["618-333-1203"]),
  gym("g07", "Champeon", ["Edgar Yosimar López Adame"], "Asiano #220, Jardines de Durango C.P. 34200", ["618-229-9296"]),
  gym("g08", "Charol", ["Francisco Javier Enríquez Córdova"], "Blvd. Fco. Villa #3100-A, Fracc. Gpe. Victoria Infonavit C.P. 34220", ["618-257-4767"]),
  gym("g09", "Chatito", ["José Antonio González"], "Armando del Castillo Franco #222, Col. Gobernadores C.P. 34045", ["618-141-6777"]),
  gym("g10", "City Fit", ["Osiel Díaz"], "Aquiles Serdán #1100, Col. Nueva Vizcaya C.P. 34080", ["618-423-9022"]),
  gym("g11", "Cuartelazo", ["Mario René Ríos"], "Av. Estación esq. Platino, Fidel Velázquez C.P. 34010", ["618-321-7431"]),
  gym("g12", "Curita de Boxeo", ["Manuel de Jesús Burciaga Pérez"], "Pereyra #1615, Zona Centro C.P. 34000", ["618-188-2058"]),
  gym("g13", "DAP Box", ["Paola V. Tirado Jara"], "C. Cerro del Mercado #338, Col. Cerro de Mercado III C.P. 34029", ["618-133-4724", "618-151-4676"]),
  gym("g14", "El Refugio", ["Moisés Aguilar"], "Francisco Márquez #703, Col. El Refugio C.P. 34179", ["618-166-8114"]),
  gym("g15", "Elemente", ["Armando Germán Bautista"], "Instituto Politécnico Nacional #101, Fracc. Real del Mezquital", ["618-317-1269"]),
  gym("g16", "Escuela de Boxeo", ["Mario Reyes"], "Unidad Deportiva José Revueltas", ["618-109-3140"]),
  gym("g17", "Escorpión", ["Arturo Olivas", "Jesús Rigoberto Ramírez"], "San Claudio #219, Col. San José 2 C.P. 34116", ["618-101-7494"]),
  gym("g18", "Felmad", ["Francisco Javier Hernández Villa"], "Ignacio Zaragoza #403, Col. Felipe Ángeles C.P. 34048", ["618-270-9686"]),
  gym("g19", "Garcias", ["Antonio Guillermo García Moctezuma"], "Durango, Dgo.", ["618-302-6045"]),
  gym("g20", "Guerreros", ["César Aldama"], "Unidad Benito Juárez", ["618-332-9800"]),
  gym("g21", "Golden Kid Boxing Academy / Green Fit", ["Saúl Guereca F."], "Patoni #252 Int., Centro C.P. 34000", ["618-236-8517"]),
  gym("g22", "Human Kinetic's", ["Marcos González"], "Av. Durango #100, Fracc. SARH C.P. 34120", []),
  gym("g23", "IED", ["Ana Laura Fernández Galván"], "Heroico Colegio Militar S/N, Zona Centro C.P. 34000", ["618-220-7823"]),
  gym("g24", "IED (Leos)", ["Antonio de Jesús Leos y Romo"], "Heroico Colegio Militar S/N, Zona Centro C.P. 34000", ["618-831-1580"]),
  gym("g25", "Lupita", ["Efraín Ramos"], "Tuito #218, Fracc. Canelas C.P. 34290", ["618-184-5789"]),
  gym("g26", "Machos", ["Oscar Manuel Silva Tinoco"], "Simón Bolívar #205, Col. José Ángel Leal C.P. 34206", ["618-188-2345"]),
  gym("g27", "Macías", ["Osvaldo Macías Santillán"], "C. Madroños #135, Col. Valle Verde C.P. 34194", ["618-107-4329"]),
  gym("g28", "MDK Multideportivo Refugio", ["Agustín Reyes"], "Col. El Refugio", ["618-292-1736"]),
  gym("g29", "Morales", ["Víctor Hugo Morales Luna"], "Col. Insurgentes", ["618-171-9287"]),
  gym("g30", "Moreno", ["Eleazar Moreno Vargas"], "Orio #825, Fracc. Villas del Guadiana IV C.P. 34224", ["618-116-3857"]),
  gym("g31", "Nubes", ["Víctor Manuel Ayala Castañeda"], "Av. Resplandor S/N C.P. 34224", ["618-308-2639"]),
  gym("g32", "Olimpo", ["Alan Garay"], "Elpidio G. Velázquez #706, Col. J. Gpe. Rodríguez C.P. 34280", []),
  gym("g33", "Paco Valenzuela", ["Mario Ríos"], "Miguel Trillo #100, Col. Felipe Ángeles C.P. 34048", ["618-126-2752"]),
  gym("g34", "Palacio de Combate", ["José Ángel Lomas Flores"], "Toma de Zacatecas #131, Col. División del Norte C.P. 34140", ["618-549-9122"]),
  gym("g35", "Puma Rodríguez", ["José Luis Puma Rodríguez"], "Wilfrano Torres #122 esq. Ignacio de la Llave, Col. El Alacrán C.P. 34167", ["618-100-3847"]),
  gym("g36", "Rick Sons", ["Ricardo Ochoa Toca"], "Av. La Salle #509 Local #6, Fracc. La Salle C.P. 34107", ["618-369-4999"]),
  gym("g37", "Rocket / Maestrito", ["José Luis López"], "Durango, Dgo.", ["618-453-9554"]),
  gym("g38", "Sangre x Sangre", ["Cruz Alfredo Durán Sarmiento"], "Paseo del Recuerdo #301, Fracc. Las Alamedas C.P. 34106", ["618-253-0926"]),
  gym("g39", "The Bulls", ["José Rubén Soto Lugo"], "Av. Del Factor #305, Col. Benjamín Méndez C.P. 34020", ["618-256-3812"]),
  gym("g40", "Trejo's", ["Luis Enrique Trejo Silva"], "C. 24 de Mayo #404, Col. Miguel de la Madrid C.P. 34046", ["618-174-1639"]),
  gym("g41", "Torres Gym", ["César Gerónimo Torres Soriano"], "Col. José Martí", ["618-147-4558"]),
  gym("g42", "U.S.A.", ["Mario Antonio Pérez Martínez"], "Claudia Guerra S/N, Fracc. Jardines de San Antonio C.P. 34229", ["618-231-3906"]),
  gym("g43", "UKG", ["Martín Palomares"], "Paloma #217, Zona Centro", ["618-271-2214"]),
  gym("g44", "Villalobos", ["José Luján Villalobos"], "San Juan #409, Col. San Carlos C.P. 34168", ["618-113-6224"]),
  gym("g45", "Villanueva / Wicho Rentería", ["Luis Roberto Rentería Arellano"], "Toribio Ortega #515, Col. Felipe Ángeles C.P. 34048", ["618-183-6408"]),
  gym("g46", "Zorrito", ["Valentín Rocha"], "Av. San Luis Local #1, Fracc. San Luis C.P. 34224", ["618-133-6663"]),
  gym("g47", "Zamudio Boxing", ["Osvaldo Zamudio Castrellón"], "Fracc. San Juan", ["618-156-8293"]),

  // Municipios
  gym("m01", "Almanza", ["David Almanza Valenzuela"], "Santiago Papasquiaro, Dgo.", ["618-453-9118"], "municipio", "Santiago Papasquiaro"),
  gym("m02", "Chinacates", ["Iván Martínez Jacobo"], "Chinacates, Dgo.", ["674-107-2769"], "municipio", "Chinacates"),
  gym("m03", "Chivo Rivas", ["Josafat Cruz Aragón"], "Zaragoza #357, Zona Centro, Lerdo, Dgo.", ["871-380-3930"], "municipio", "Lerdo"),
  gym("m04", "De la Cruz Boxing", ["Arturo de la Cruz Camacho"], "Lerdo, Dgo.", ["871-845-6580"], "municipio", "Lerdo"),
  gym("m05", "Elka", ["Ángel Jassiel Díaz Bonilla"], "El Salto, Dgo.", ["618-323-5799"], "municipio", "El Salto"),
  gym("m06", "Escuela Municipal Isidro Gallegos", ["Isidro Gallegos"], "Av. Diamante #766, Gómez Palacio C.P. 35029", [], "municipio", "Gómez Palacio"),
  gym("m07", "Gym Box Castro", ["Cristian Castro Aguilar", "Chantal Castro Orozco"], "Lerdo, Dgo.", ["871-502-3120"], "municipio", "Lerdo"),
  gym("m08", "Gym Calixto Boxing", ["Calixto Manuel Castorena Coronado"], "Gómez Palacio, Dgo.", [], "municipio", "Gómez Palacio"),
  gym("m09", "Gym Flores / Villegas", ["Pedro Erasmo Flores Jiménez", "Rubén Villegas"], "Ave. Guadalupe Victoria #1203, León Guzmán, Dgo.", ["871-428-0928"], "municipio", "León Guzmán"),
  gym("m10", "Gym Gallegos", ["Juan Carlos Gallegos Alvarado", "Juana María Rocha Coronado"], "Gómez Palacio, Dgo.", ["871-307-4165"], "municipio", "Gómez Palacio"),
  gym("m11", "Gym Mora (El Sargento)", ["Carlos Mora Torres"], "Guadalupe Victoria, Dgo.", ["676-115-914"], "municipio", "Guadalupe Victoria"),
  gym("m12", "Gym Qarito", ["Ma. Carolina Montelongo"], "Villa Unión, Dgo.", ["618-169-0503"], "municipio", "Villa Unión"),
  gym("m13", "Gym Rivera", ["Alejandro Rivera"], "Gómez Palacio, Dgo.", ["871-172-9779"], "municipio", "Gómez Palacio"),
  gym("m14", "Gym Siempre Amigos", ["Carlos Sonora Martínez", "Martín Morales Félix"], "Gómez Palacio, Dgo.", ["871-125-3332"], "municipio", "Gómez Palacio"),
  gym("m15", "Huracán", ["Eduin Noé Ontiveros Rodríguez"], "Canatlán, Dgo.", ["618-583-8031", "618-304-7985"], "municipio", "Canatlán"),
  gym("m16", "MU Boxing", ["Jorge Arturo Ayala Medina", "Marisol Ayala Sillas"], "Rodeo, Dgo.", ["667-105-8366"], "municipio", "Rodeo"),
  gym("m17", "Prime Boxing", ["Antonio Quiñones"], "Nuevo Ideal, Dgo.", ["677-113-0225"], "municipio", "Nuevo Ideal"),
  gym("m18", "Robledo Gym Box", ["José Luis Robledo Ávila"], "Gómez Palacio, Dgo.", [], "municipio", "Gómez Palacio"),
  gym("m19", "Round 13", ["Arturo Iván Bustamante Garza"], "Filadelfia Calle 22, Gómez Palacio, Dgo.", ["871-358-9134"], "municipio", "Gómez Palacio"),
  gym("m20", "Team Boxing Mora", ["Ángel de Jesús Mora Ramírez"], "San Daniel 2, Lerdo, Dgo.", ["871-273-4886"], "municipio", "Lerdo"),
  gym("m21", "Gym General Fco. Villa", ["Antonio Baltimore"], "Tepehuanes, Dgo.", ["674-100-8165"], "municipio", "Tepehuanes"),
  gym("m22", "Tlahualilo", ["Juan Pablo Berumen Torres", "Oscar Carrillo"], "Tlahualilo, Dgo.", ["872-138-9131", "872-118-1929"], "municipio", "Tlahualilo"),
  gym("m23", "Villa Unión", ["Antonio Baltimore"], "Villa Unión Poanas, Dgo.", ["675-115-3175"], "municipio", "Villa Unión Poanas"),
  gym("m24", "Walhalla", ["Cristopher Veliám Reyes Pérez"], "El Salto, Dgo.", ["675-102-9694"], "municipio", "El Salto"),
  gym("m25", "Eduardo García", ["Eduardo García"], "Santiago Papasquiaro, Dgo.", ["674-101-4411"], "municipio", "Santiago Papasquiaro"),
  gym("m26", "Escuela de Boxeo Est. Poanas", ["Erik Hernández"], "Estación Poanas, Dgo.", ["618-131-1023"], "municipio", "Estación Poanas"),
];

export const DURANGO_CHAMPIONS: { division: BoxingDivision; fighter: BoxingFighter }[] = [
  {
    division: "Pesado",
    fighter: {
      id: "f1",
      name: "Luis Rentería",
      gym: "Villanueva / Wicho Rentería",
      division: "Pesado",
      record: "18-2-0",
      photo: BOXER_PHOTOS[0],
      trend: "same",
    },
  },
  {
    division: "Crucero",
    fighter: {
      id: "f2",
      name: "José Luján Villalobos",
      gym: "Villalobos",
      division: "Crucero",
      record: "14-1-1",
      photo: BOXER_PHOTOS[1],
      trend: "up",
    },
  },
  {
    division: "Semipesado",
    fighter: {
      id: "f3",
      name: "César Aldama",
      gym: "Guerreros",
      division: "Semipesado",
      record: "16-3-0",
      photo: BOXER_PHOTOS[2],
      trend: "same",
    },
  },
  {
    division: "Supermedio",
    fighter: {
      id: "f4",
      name: "Osvaldo Macías",
      gym: "Macías",
      division: "Supermedio",
      record: "12-0-1",
      photo: BOXER_PHOTOS[3],
      trend: "up",
    },
  },
  {
    division: "Medio",
    fighter: {
      id: "f5",
      name: "Saúl Guereca",
      gym: "Golden Kid",
      division: "Medio",
      record: "21-4-0",
      photo: BOXER_PHOTOS[4],
      trend: "down",
    },
  },
  {
    division: "Superwelter",
    fighter: {
      id: "f6",
      name: "Jesús Bueno",
      gym: "Bueno's Boxing",
      division: "Superwelter",
      record: "15-2-0",
      photo: BOXER_PHOTOS[5],
      trend: "up",
    },
  },
  {
    division: "Welter",
    fighter: {
      id: "f7",
      name: "Mario Reyes",
      gym: "Escuela de Boxeo",
      division: "Welter",
      record: "19-1-0",
      photo: BOXER_PHOTOS[0],
      trend: "same",
    },
  },
  {
    division: "Superligero",
    fighter: {
      id: "f8",
      name: "Néstor Flores",
      gym: "Boom",
      division: "Superligero",
      record: "11-0-0",
      photo: BOXER_PHOTOS[1],
      trend: "up",
    },
  },
  {
    division: "Ligero",
    fighter: {
      id: "f9",
      name: "Edgar López Adame",
      gym: "Champeon",
      division: "Ligero",
      record: "13-2-1",
      photo: BOXER_PHOTOS[2],
      trend: "same",
    },
  },
  {
    division: "Pluma",
    fighter: {
      id: "f10",
      name: "Valentín Rocha",
      gym: "Zorrito",
      division: "Pluma",
      record: "10-1-0",
      photo: BOXER_PHOTOS[3],
      trend: "up",
    },
  },
  {
    division: "Mosca",
    fighter: {
      id: "f11",
      name: "Paola Tirado",
      gym: "DAP Box",
      division: "Mosca",
      record: "9-0-0",
      photo: BOXER_PHOTOS[4],
      trend: "up",
    },
  },
];

export const P4P_MALE: BoxingFighter[] = [
  {
    id: "p1",
    name: "Mario Reyes",
    gym: "Escuela de Boxeo",
    division: "Welter",
    record: "19-1-0",
    photo: BOXER_PHOTOS[0],
    trend: "same",
  },
  {
    id: "p2",
    name: "Saúl Guereca",
    gym: "Golden Kid",
    division: "Medio",
    record: "21-4-0",
    photo: BOXER_PHOTOS[4],
    trend: "up",
  },
  {
    id: "p3",
    name: "Luis Rentería",
    gym: "Villanueva",
    division: "Pesado",
    record: "18-2-0",
    photo: BOXER_PHOTOS[1],
    trend: "down",
  },
];

export const P4P_FEMALE: BoxingFighter[] = [
  {
    id: "pf1",
    name: "Paola Tirado",
    gym: "DAP Box",
    division: "Mosca",
    record: "9-0-0",
    photo: BOXER_PHOTOS[4],
    trend: "same",
  },
  {
    id: "pf2",
    name: "Ana Laura Fernández",
    gym: "IED",
    division: "Pluma",
    record: "7-1-0",
    photo: BOXER_PHOTOS[5],
    trend: "up",
  },
  {
    id: "pf3",
    name: "Ma. Carolina Montelongo",
    gym: "Gym Qarito",
    division: "Ligero",
    record: "6-0-1",
    photo: BOXER_PHOTOS[2],
    trend: "down",
  },
];

export const BOXING_SCHEDULE: BoxingBout[] = [
  {
    id: "b1",
    dateLabel: "Miércoles 27 Ago",
    left: { name: "Mario Reyes", rank: 1 },
    right: { name: "Néstor Flores", rank: 8 },
    venue: "Unidad Deportiva José Revueltas",
  },
  {
    id: "b2",
    dateLabel: "Miércoles 27 Ago",
    left: { name: "Paola Tirado", rank: 1 },
    right: { name: "Ana Laura Fernández", rank: 2 },
    venue: "DAP Box",
  },
  {
    id: "b3",
    dateLabel: "Viernes 29 Ago",
    left: { name: "Jesús Bueno", rank: 6 },
    right: { name: "Edgar López", rank: 9 },
    venue: "Bueno's Boxing",
  },
  {
    id: "b4",
    dateLabel: "Viernes 29 Ago",
    left: { name: "Osvaldo Macías", rank: 4 },
    right: { name: "César Aldama", rank: 3 },
    venue: "Palacio de Combate",
  },
  {
    id: "b5",
    dateLabel: "Sábado 30 Ago",
    left: { name: "Saúl Guereca", rank: 2 },
    right: { name: "José Luján Villalobos", rank: 5 },
    venue: "Golden Kid Boxing Academy",
  },
  {
    id: "b6",
    dateLabel: "Sábado 30 Ago",
    left: { name: "Valentín Rocha", rank: 10 },
    right: { name: "Arturo Olivas", rank: 12 },
    venue: "Zorrito Gym",
  },
  {
    id: "b7",
    dateLabel: "Domingo 31 Ago",
    left: { name: "Luis Rentería", rank: 3 },
    right: { name: "Antonio García", rank: 11 },
    venue: "Villanueva Gym",
  },
];

export const FEATURED_FIGHTER: BoxingFighter = {
  id: "feat",
  name: "Mario Reyes",
  gym: "Escuela de Boxeo · Unidad José Revueltas",
  division: "Welter",
  record: "19-1-0 · 12 KO",
  photo: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80",
  trend: "same",
};
