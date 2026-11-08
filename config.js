// ==========================================================================
// DP | FILMS — Firebase Configuration & Data Source
// Dominik Šuškevič — Videographer, Photographer & Filmmaker
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyAVQrRsnfshJRzvvvIpWvbq5xMaa9PNCcw",
  authDomain: "dominikphotofficial-films.firebaseapp.com",
  projectId: "dominikphotofficial-films",
  storageBucket: "dominikphotofficial-films.firebasestorage.app",
  messagingSenderId: "636850576344",
  appId: "1:636850576344:web:d35487f55d61aeedbdb0ad",
  measurementId: "G-C9VWR6ZEM8"
};

// Target Firestore collection for recruitment and pitches
export const FIRESTORE_COLLECTION = 'submissions';
export const STORAGE_FOLDER = 'submissions';
export const ADMIN_EMAIL = 'dominikphotofficial.lt@gmail.com';

export const contactLinks = {
  email: "info@dominikphotofficial.lt",
  instagram: {
    label: "Instagram",
    handle: "@dominikphotofficial",
    url: "https://www.instagram.com/dominikphotofficial",
    badge: "Direct DM"
  },
  telegram: {
    label: "Telegram",
    handle: "@dominikphotofficial",
    url: "https://t.me/dominikphotofficial",
    badge: "Chat"
  },
  photographyPortfolio: "https://portfolio.dominikphotofficial.lt",
  festival: {
    name: "Ąžuolynas International Film Festival (AISFF)",
    instagramUrl: "https://www.instagram.com/azuolynasfilmfestival",
    instagramHandle: "@azuolynasfilmfestival",
    websiteUrl: "https://azuolynasinternationalfilmfestival.github.io/"
  }
};

export const filmsList = [
  {
    id: "frozen-time-what-if",
    title: "FROZEN TIME: WHAT IF",
    year: "2026",
    youtubeId: "bcLq-VXBpzI",
    specs: "Directed, Shot & Edited by Dominik · 1st Place Winner AISFF 2026",
    award: "1st Place Winner — Ąžuolynas International Student Film Festival (AISFF 2026)",
    desc: {
      en: "Winner of the Ąžuolynas International Student Film Festival. A cinematic exploration of stillness, human presence, and time.",
      lt: "Nugalėtojo filmas Ąžuolyno tarptautiniame studentų kino festivalyje. Laiko, erdvės ir egzistencinių pasirinkimų kinematografinė analizė."
    }
  },
  {
    id: "winter-cirkliskis-2025",
    title: "WINTER | CIRKLIŠKIS",
    year: "2025",
    youtubeId: "UHx5LrClink",
    specs: "Cinematic Winter Study",
    desc: {
      en: "Monochromatic winter stillness and heritage geometry captured in cold daylight.",
      lt: "Monochrominė žiemos ramybė ir dvaro apylinkių geometrija šaltoje šviesoje."
    }
  },
  {
    id: "winter-sventa-2025",
    title: "WINTER | ŠVENTA",
    year: "2025",
    youtubeId: "XRJbHKVramA",
    specs: "Atmospheric Visual Poetry",
    desc: {
      en: "Pure natural stillness, mist, and raw winter light in Šventa landscapes.",
      lt: "Gryna gamtos ramybė, rūkas ir natūrali žiemos šviesa Šventos apylinkėse."
    }
  },
  {
    id: "winter-kauno-marios-2025",
    title: "WINTER | KAUNO MARIOS",
    year: "2025",
    youtubeId: "z02gKOaMJxw",
    specs: "Drone & Ground Cinematography",
    desc: {
      en: "Frozen expanses, wind textures, and the stark winter horizon of Kauno Marios.",
      lt: "Ledo platybės, vėjo tekstūros ir Kauno marių žiemos horizontas."
    }
  },
  {
    id: "winter-forest-2025",
    title: "WINTER | FOREST",
    year: "2025",
    youtubeId: "auGtquFMqBg",
    specs: "Deep Forest Mood",
    desc: {
      en: "Forest silence, snow patterns, and deep contrast through the woodland canopy.",
      lt: "Miško tyla, sniego šešėliai ir šviesos kontrastai tarp pušų kamienų."
    }
  },
  {
    id: "the-village-kaimas-2024",
    title: "THE VILLAGE (KAIMAS)",
    year: "2024",
    youtubeId: "VIl8znMZYEA",
    specs: "Shot on Samsung A34",
    desc: {
      en: "Documentary rhythm of village life, authentic characters, and nostalgic texture.",
      lt: "Dokumentinis kaimo gyvenimo ritmas, autentiški charakteriai ir nostalgiška tekstūra."
    }
  },
  {
    id: "mikio-kelione-2024",
    title: "Mikio Kelionė",
    year: "2024",
    youtubeId: "qbA6W_XckMI",
    specs: "Narrative Short",
    desc: {
      en: "A playful visual narrative following a character's journey through contrasting landscapes.",
      lt: "Nuotaikingas ir vizualus pasakojimas apie mažo personažo didelę kelionę."
    }
  },
  {
    id: "nature-video-2024",
    title: "NATURE VIDEO",
    year: "2024",
    youtubeId: "ROSzuN4vsiE",
    specs: "Natural Lighting & Organic Movement",
    desc: {
      en: "Textures of water, wind, and vegetation captured with organic ambient light.",
      lt: "Vandens, vėjo ir lapų judėjimo detalės be dirbtinio apšvietimo."
    }
  },
  {
    id: "exit-2024",
    title: "EXIT",
    year: "2024",
    youtubeId: "buw2uCYHTfA",
    specs: "Cinematic Short",
    desc: {
      en: "Short film exploring claustrophobia, dramatic tension, and the quest for an exit.",
      lt: "Trumpametražis filmas apie uždaras erdves, įtampą ir ieškomą išėjimą."
    }
  },
  {
    id: "cirkliskis-2024",
    title: "Cirkliškis",
    year: "2024",
    youtubeId: "U9eYg2HCX08",
    specs: "Visual Exploration",
    desc: {
      en: "Cirkliškis manor grounds, architectural motifs, and midsummer chiaroscuro.",
      lt: "Cirkliškio dvaro parko erdvės, architektūriniai elementai ir vasaros šviesotamsa."
    }
  },
  {
    id: "ruduo-prie-gimnazijos-2024",
    title: "Ruduo Prie Gimnazijos",
    year: "2024",
    youtubeId: "779CwbrvWpA",
    specs: "Švenčionėlių Karaliaus Mindaugo gimnazija",
    desc: {
      en: "Autumn colors, school grounds, and fleeting memories in Švenčionėliai.",
      lt: "Rudens spalvos, mokyklos aplinka ir jaunystės akimirkos Švenčionėliuose."
    }
  }
];
