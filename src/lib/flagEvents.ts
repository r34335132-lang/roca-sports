/**
 * EVENTOS DE FLAG — aquí se edita todo lo que sale en la página del evento.
 *
 * Para cada jugadora puedes cambiar:
 *   - name, number, position
 *   - photo: ruta dentro de /public ("/flag/jugadoras/ana.jpg") o URL ("https://...").
 *            Ocupa toda la carta; las calificaciones van encima de la parte de abajo.
 *   - photoFocus (opcional): { x, y, zoom } para encuadrar la foto. x/y van de 0 a 1 (0.5 = centro)
 *            y marcan el punto de la foto que quieres ver arriba de las stats; zoom 1.3 = acercar 30%.
 *   - bio: el texto que aparece al tocar "Saber más". Separa párrafos con \n\n.
 *   - ratings: calificaciones de 0 a 99. El OVR (general) se calcula solo con el promedio.
 *   - rarity (opcional): "base" | "oro" | "prizm" | "leyenda". Si no lo pones, se asigna por OVR.
 */

export type FlagRatings = {
  pases: number;
  rapidez: number;
  cachar: number;
  intercepciones: number;
  vision: number;
};

export type FlagRarity = "base" | "oro" | "prizm" | "leyenda";

export type FlagCardPlayer = {
  id: string;
  name: string;
  /** Déjalo en null si todavía no se sabe; la carta se muestra sin número. */
  number: number | null;
  position: string;
  photo?: string | null;
  photoFocus?: { x?: number; y?: number; zoom?: number };
  bio: string;
  ratings: FlagRatings;
  rarity?: FlagRarity;
};

export type FlagEventTeam = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  /** Fondo detrás del logo (los logos vienen sobre blanco). */
  logoBackground: string;
  primary: string;
  accent: string;
  roster: FlagCardPlayer[];
};

export type FlagEvent = {
  slug: string;
  title: string;
  subtitle: string;
  organizer: string;
  poster: string;
  logo: string;
  /** Fecha del juego en hora de Durango. Si cambias la hora, cambia también timeLabel. */
  kickoff: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  theme: { primary: string; accent: string };
  home: FlagEventTeam;
  away: FlagEventTeam;
  /** Pon el marcador cuando termine el juego, ej. { home: 21, away: 14 }. */
  score?: { home: number; away: number } | null;
  /** Duelo destacado entre una jugadora de cada equipo (usa los id del roster). */
  featuredDuel?: { homePlayerId: string; awayPlayerId: string; title: string; subtitle?: string } | null;
  /** MVP del juego (id del roster). Su carta sale en edición especial. */
  mvpPlayerId?: string | null;
};

/** Campeona: todas las del equipo ganador. MVP: la jugadora de mvpPlayerId. */
export type FlagCardEdition = "campeona" | "mvp";

export const FLAG_DURANGO_LOGO = "/flag/flag-durango.png";

export const FEDERATION_LOGOS = [
  { src: "/flag/fad.png", short: "FAD", name: "Asociación Estatal de Flag y Futbol Americano de Durango" },
  { src: "/flag/fmfa.png", short: "FMFA", name: "Federación Mexicana de Futbol Americano" },
];

export const RATING_LABELS: { key: keyof FlagRatings; short: string; label: string }[] = [
  { key: "pases", short: "PAS", label: "Pases" },
  { key: "rapidez", short: "RAP", label: "Rapidez" },
  { key: "cachar", short: "CAT", label: "Cachar" },
  { key: "intercepciones", short: "INT", label: "Intercepciones" },
  { key: "vision", short: "VIS", label: "Visión" },
];

export function overall(r: FlagRatings) {
  return Math.round((r.pases + r.rapidez + r.cachar + r.intercepciones + r.vision) / 5);
}

export function rarityOf(player: FlagCardPlayer): FlagRarity {
  if (player.rarity) return player.rarity;
  const ovr = overall(player.ratings);
  if (ovr >= 90) return "leyenda";
  if (ovr >= 82) return "prizm";
  if (ovr >= 74) return "oro";
  return "base";
}

const jugadora = (file: string) => `/flag/jugadoras/${file}.jpg`;

export const BLACK_RAVENS: FlagEventTeam = {
  id: "black-ravens",
  name: "Black Ravens",
  shortName: "RAVENS",
  logo: "/flag/black-ravens.png",
  logoBackground: "#ffffff",
  primary: "#2b1a4a",
  accent: "#8b5cf6",
  roster: [
    {
      id: "black-ravens-fernanda",
      name: "Fernanda",
      number: 9,
      position: "QB",
      photo: jugadora("fernanda"),
      photoFocus: { x: 0.52, y: 0.42, zoom: 1.35 },
      bio: "Tras practicar fútbol soccer durante años, descubrí el flag football hace 4 años y se convirtió en mi deporte favorito.",
      ratings: { pases: 99, rapidez: 96, cachar: 92, intercepciones: 90, vision: 99 },
      rarity: "leyenda",
    },
    {
      id: "black-ravens-jatshiry",
      name: "Jatshiry Jeraldy Mancillas Nuñez",
      number: 10,
      position: "WR / QB",
      photo: jugadora("jatshiry"),
      photoFocus: { x: 0.47, y: 0.45, zoom: 1.1 },
      bio: "Jugué básquetbol desde chica, pero un día descubrí el tocho y ya llevo 3 años en este deporte que cambió mi vida por completo.",
      ratings: { pases: 94, rapidez: 96, cachar: 97, intercepciones: 78, vision: 92 },
    },
    {
      id: "black-ravens-camila",
      name: "Camila Rojas",
      number: 17,
      position: "WR / CB",
      photo: jugadora("camila"),
      photoFocus: { x: 0.47, y: 0.42, zoom: 1.15 },
      bio:
        "Empecé a jugar flag en el equipo de mi preparatoria en 2022 para liberar mi servicio social. En el proceso me gustó mucho el deporte y seguí jugando hasta la actualidad con mi mismo equipo, pero con diferente nombre: ahora Black Ravens. Gracias al flag he podido crecer en mi disciplina y mi confianza, y por esa disciplina fui seleccionada para la LMT 2026.\n\nEl flag también me ha acercado a otros ámbitos del deporte: el año pasado me invitaron a ser árbitro y este año, como ref, he podido arbitrar en FlagDgo y en otros torneos del estado, creciendo en mi conocimiento del reglamento y explorando todo lo que este deporte tiene para dar.",
      ratings: { pases: 76, rapidez: 94, cachar: 93, intercepciones: 92, vision: 91 },
    },
    {
      id: "black-ravens-gabriela",
      name: "Gabriela",
      number: null,
      position: "WR",
      photo: jugadora("gabriela"),
      photoFocus: { x: 0.5, y: 0.35, zoom: 1.1 },
      bio: "Llevo 4 años practicando flag; inicié cuando entré a la prepa. Antes de eso estuve 3 años en boxeo y, cuando era niña, practiqué gimnasia durante 5 años.",
      ratings: { pases: 80, rapidez: 92, cachar: 93, intercepciones: 82, vision: 91 },
    },
    {
      id: "black-ravens-marijose",
      name: "Marijose Solís Delgado",
      number: 99,
      position: "WR",
      photo: jugadora("marijose"),
      bio: "Empecé a jugar tocho cuando comencé la prepa con el equipo Búfalos UIM, el cual combiné con entrenamientos de porras durante un tiempo.",
      ratings: { pases: 72, rapidez: 90, cachar: 99, intercepciones: 76, vision: 93 },
    },
    {
      id: "black-ravens-melany",
      name: "Melany Abigail García Muñoz",
      number: 14,
      position: "WR / LB",
      photo: jugadora("melany"),
      photoFocus: { x: 0.55, y: 0.35, zoom: 1.15 },
      bio: "Llevo alrededor de 3 años jugando tocho bandera y he estado en 3 equipos. Antes de empezar en el tocho bandera practicaba fútbol soccer y voleibol.",
      ratings: { pases: 68, rapidez: 89, cachar: 92, intercepciones: 86, vision: 84 },
    },
    {
      id: "black-ravens-maria-guadalupe",
      name: "María Guadalupe Hernández Tremillo",
      number: 22,
      position: "Center",
      photo: jugadora("maria-guadalupe"),
      photoFocus: { x: 0.52, y: 0.4, zoom: 1.15 },
      bio:
        "“Vive tu momento, porque el tiempo pasa y no perdona.”\n\nJugadora desde los 13 años. Juego como center titular: en los pases cortos puedo servir y avanzar, y mi fuerte es la habilidad con los centros. Empecé en el flag en 2012, un año adelantada en la escuela; hoy tengo 23 años y en el camino conocí a grandes estrellas como Andrea Monsiváis, Valeri Carranza y Rodrigo Aquino. Antes practicaba atletismo, donde fui campeona y subcampeona por dos años.\n\nTrayectoria: Leonas Flag de la EST 61 (2012–2014), Burros Blancos ITD (2018–2021), Redfox Flag (2021–2022) y Black Ravens Flag (2025–2026).\n\nLogros:\n• Subcampeonas nacionales en Zacatecas con Burras Blancas (sep 2021)\n• Campeonas con Black Ravens en la Lobos Night League (oct 2025)\n• Campeonas de la Liga Otoño-Invierno Flag Durango",
      ratings: { pases: 74, rapidez: 78, cachar: 95, intercepciones: 76, vision: 92 },
    },
    {
      id: "black-ravens-darla",
      name: "Darla Castrellón Hernández",
      number: 8,
      position: "Rusher",
      photo: jugadora("darla"),
      photoFocus: { x: 0.52, y: 0.45, zoom: 1.1 },
      bio: "Estuve en natación y después me cambié al tochito bandera, deporte en el que llevo 3 años aprendiendo, creciendo y viviendo nuevas experiencias que me han dejado grandes enseñanzas.",
      ratings: { pases: 62, rapidez: 94, cachar: 76, intercepciones: 84, vision: 86 },
    },
  ],
};

export const DSM: FlagEventTeam = {
  id: "dsm",
  name: "DSM",
  shortName: "DSM",
  logo: "/flag/dsm.png",
  logoBackground: "#ffffff",
  primary: "#111111",
  accent: "#e5e7eb",
  roster: [
    {
      id: "dsm-valeria",
      name: "Valeria Morán",
      number: 12,
      position: "Corredora",
      photo: jugadora("valeria"),
      photoFocus: { x: 0.6, y: 0.35, zoom: 1.25 },
      bio:
        "Llevo jugando desde 2017, pasando por todas las posiciones hasta terminar de QB. Gané 3 torneos con Lobas UAD y tuve participación en el Nacional de Tocho 2021.\n\nEn 2022 entré a jugar americano como QB principal y obtuve 2 campeonatos y 2 MVP ofensivos.\n\nActualmente soy coach de Axis y corredora en el equipo DSM desde hace 2 años.",
      ratings: { pases: 94, rapidez: 91, cachar: 88, intercepciones: 84, vision: 96 },
      rarity: "leyenda",
    },
    {
      id: "dsm-brenda",
      name: "Brenda Natalia Candia Galarza",
      number: 19,
      position: "WR / QB",
      photo: jugadora("brenda"),
      photoFocus: { x: 0.46, y: 0.35, zoom: 1.2 },
      bio: "Tengo 10 años jugando. Comencé porque siempre me han gustado los deportes; jugué de todo, pero este fue el deporte que más me llenó. Realmente me salvó y tengo mucho que agradecerle.",
      ratings: { pases: 89, rapidez: 82, cachar: 90, intercepciones: 80, vision: 88 },
    },
    {
      id: "dsm-nancy",
      name: "Nancy Rosales Navarro",
      number: null,
      position: "Corredora / LB / CB / QB",
      photo: jugadora("nancy"),
      photoFocus: { x: 0.44, y: 0.45, zoom: 1.3 },
      bio:
        "Mi historia comienza en el fútbol americano en 2015, y hace aproximadamente 8 años encontré en el flag football una pasión que hoy forma parte de mí.\n\n" +
        "Corredora, linebacker, cornerback y, en ocasiones, quarterback. Diferentes posiciones, una misma mentalidad: dejar el corazón en cada jugada y nunca dejar de crecer.\n\n" +
        "Soy fiel creyente de que LA OBSESIÓN VENCE AL TALENTO 🔥. Porque el talento abre puertas, pero la disciplina, la pasión y la constancia te llevan más lejos.",
      ratings: { pases: 80, rapidez: 88, cachar: 84, intercepciones: 87, vision: 88 },
    },
    {
      id: "dsm-marleny",
      name: "Marleny Jazel Sánchez Álvarez",
      number: null,
      position: "WR",
      photo: jugadora("marleny"),
      photoFocus: { x: 0.5, y: 0.3, zoom: 1.05 },
      bio:
        "Desde 2017, el Flag Football se ha convertido en una parte fundamental de mi vida. A lo largo de estos 9 años he tenido la oportunidad de representar a distintos equipos en torneos locales y nacionales, consiguiendo campeonatos, subcampeonatos y reconocimientos individuales como líder de anotaciones y recepciones.\n\n" +
        "Mi pasión por este deporte también me ha llevado a participar como coach y staff en NFL Flag Durango, compartiendo con nuevas generaciones todo lo que este deporte me ha enseñado.\n\n" +
        "Más que un deporte, el Flag Football se ha convertido en una historia de retos, aprendizajes y grandes amistades.",
      ratings: { pases: 72, rapidez: 89, cachar: 93, intercepciones: 74, vision: 91 },
    },
    {
      id: "dsm-ximena",
      name: "Ximena Rosales",
      number: 7,
      position: "CB / WR / C / LB / S",
      photo: jugadora("ximena"),
      photoFocus: { x: 0.45, y: 0.3, zoom: 1.1 },
      bio: "Llevo jugando 5 años y actualmente soy coach de Osas. En el campo juego de cornerback, receptora, center, linebacker y safety.",
      ratings: { pases: 70, rapidez: 85, cachar: 91, intercepciones: 85, vision: 86 },
    },
    {
      id: "dsm-leslie",
      name: "Leslie Yoselin",
      number: 20,
      position: "WR",
      photo: jugadora("leslie"),
      photoFocus: { x: 0.62, y: 0.3, zoom: 1.2 },
      bio: "Empecé a jugar a finales de 2024 con Osas: subcampeona en categoría Silver en la temporada Otoño 2025 y campeona en categoría Silver en la temporada Primavera 2026. También llevo 2 temporadas en Justice League y recién me incorporé a DSM.",
      ratings: { pases: 66, rapidez: 86, cachar: 94, intercepciones: 76, vision: 84 },
    },
    {
      id: "dsm-karla",
      name: "Karla Vargas",
      number: null,
      position: "Center",
      photo: jugadora("karla"),
      photoFocus: { x: 0.6, y: 0.25, zoom: 1.08 },
      bio:
        "Mi trayectoria deportiva comenzó en 2017 con el equipo Osas del CBTis 110, con el que obtuve un campeonato y dos subcampeonatos. Mi participación concluyó en 2020, debido a la pandemia y al término de mis estudios de nivel medio superior.\n\n" +
        "En 2021 retomé mi actividad deportiva con los equipos Panteras y Amazonas, experiencias que me permitieron seguir desarrollándome y mantenerme activa en el ámbito competitivo.\n\n" +
        "En 2022 me integré a RedFox, una etapa importante en la que representé al equipo en diferentes estados de la República. Fui seleccionada para un torneo en Guadalajara, Jalisco, donde obtuvimos el campeonato, una de las experiencias más significativas de mi carrera.\n\n" +
        "En 2024-2025 regresé a las competencias representando al Instituto Tecnológico de Durango, con el que conseguí un campeonato.\n\n" +
        "Desde 2026 formo parte de DSM, donde ya contamos con un subcampeonato y sigo aportando mi experiencia, compromiso y trabajo en equipo para seguir creciendo y alcanzar nuevas metas.\n\n" +
        "A lo largo de mi trayectoria he adquirido disciplina, perseverancia, liderazgo, responsabilidad y trabajo en equipo. Cada etapa ha contribuido a mi crecimiento deportivo y personal, y me motiva a seguir representando con orgullo a los equipos e instituciones de los que he formado parte.",
      ratings: { pases: 78, rapidez: 74, cachar: 85, intercepciones: 78, vision: 90 },
    },
    {
      id: "dsm-estrella",
      name: "Estrella Sifuentes",
      number: null,
      position: "LB / CB / S",
      photo: jugadora("estrella"),
      photoFocus: { x: 0.5, y: 0.25, zoom: 1.1 },
      bio: "Empecé jugando de Safety; después de un tiempo pasé a Corner y terminé jugando de LB. En algunas ocasiones he jugado a la ofensiva como receptora. Jugué una semifinal con Osas en la categoría Silver.",
      ratings: { pases: 58, rapidez: 84, cachar: 78, intercepciones: 88, vision: 82 },
    },
    {
      id: "dsm-renata",
      name: "Renata Abril Moreno Celis",
      number: null,
      position: "WR / Rusher",
      photo: jugadora("renata"),
      photoFocus: { x: 0.62, y: 0.3, zoom: 1.2 },
      bio: "Anteriormente estuve en distintos deportes y, desde que llegué a este, se ha convertido en una parte muy importante de mi vida. Dentro del campo he encontrado amigos y una pasión que me impulsa a seguir aprendiendo, superar mis propios límites y crecer como jugadora.",
      ratings: { pases: 60, rapidez: 88, cachar: 82, intercepciones: 78, vision: 76 },
    },
  ],
};

export const TAZON_GRAN_FAMILIA: FlagEvent = {
  slug: "tazon-gran-familia",
  title: "Tazón de la Gran Familia",
  subtitle: "Flag Football",
  organizer: "Flag Durango",
  poster: "/flag/tazon-gran-familia.png",
  logo: "/flag/tazon-logo.png",
  kickoff: "2026-10-25T10:00:00-06:00",
  dateLabel: "Domingo 25 de octubre",
  timeLabel: "10:00 a. m.",
  venue: "Deportivo Tapias",
  theme: { primary: "#6b2fb8", accent: "#ff2e93" },
  home: BLACK_RAVENS,
  away: DSM,
  score: { home: 18, away: 12 },
  mvpPlayerId: "black-ravens-fernanda",
  featuredDuel: {
    homePlayerId: "black-ravens-fernanda",
    awayPlayerId: "dsm-valeria",
    title: "Duelo destacado",
    subtitle: "Las dos mejores del Tazón, frente a frente",
  },
};

export function findFeaturedDuel(event: FlagEvent) {
  const duel = event.featuredDuel;
  if (!duel) return null;
  const home = event.home.roster.find((p) => p.id === duel.homePlayerId);
  const away = event.away.roster.find((p) => p.id === duel.awayPlayerId);
  return home && away ? { ...duel, home, away } : null;
}

export function championOf(event: FlagEvent): FlagEventTeam | null {
  const s = event.score;
  if (!s || s.home === s.away) return null;
  return s.home > s.away ? event.home : event.away;
}

export function findMvp(event: FlagEvent) {
  if (!event.mvpPlayerId) return null;
  for (const team of [event.home, event.away]) {
    const player = team.roster.find((p) => p.id === event.mvpPlayerId);
    if (player) return { player, team };
  }
  return null;
}

export function editionOf(event: FlagEvent, player: FlagCardPlayer): FlagCardEdition | undefined {
  if (player.id === event.mvpPlayerId) return "mvp";
  if (championOf(event)?.roster.some((p) => p.id === player.id)) return "campeona";
  return undefined;
}

export function honorText(event: FlagEvent, edition: FlagCardEdition) {
  const result = event.score ? ` · ${event.home.name} ${event.score.home}-${event.score.away} ${event.away.name}` : "";
  return `${edition === "mvp" ? "MVP" : "Campeona"} del ${event.title}${result}`;
}

export const FLAG_EVENTS: FlagEvent[] = [TAZON_GRAN_FAMILIA];

export function findFlagEvent(slug: string) {
  return FLAG_EVENTS.find((e) => e.slug === slug) ?? null;
}
