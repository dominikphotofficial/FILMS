// ==========================================================================
// DP | FILMS — Configuration & Data Source
// Dominik Šuškevič — Videographer, Photographer & Filmmaker
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBxhDy4I4HZnqOAvwWE3JyjYsuy_Tg86xE",
  authDomain: "tfp-form.firebaseapp.com",
  projectId: "tfp-form",
  storageBucket: "tfp-form.firebasestorage.app",
  messagingSenderId: "542082314917",
  appId: "1:542082314917:web:34889b7aa21c7eaed0d34c",
  measurementId: "G-DHC9C90YR2"
};
export const FIRESTORE_COLLECTION = 'film_submissions';
export const STORAGE_FOLDER = 'film_uploads';
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
  whatsapp: {
    label: "WhatsApp",
    handle: "+370 600 00000",
    url: "https://wa.me/37060000000",
    badge: "Message"
  },
  messenger: {
    label: "Messenger",
    handle: "dominikphotofficial",
    url: "https://m.me/dominikphotofficial",
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
    specs: "Shot on iPhone 15 · 1st Place Winner AISFF 2026",
    award: "1 PLACE FESTIVAL — Ąžuolynas International Student Film Festival (AISFF)",
    desc: {
      lt: "Nugalėtojo filmas Ąžuolyno tarptautiniame studentų kino festivalyje. Laiko, erdvės ir egzistencinių pasirinkimų kinematografinė analizė.",
      en: "Winner of the Ąžuolynas International Student Film Festival. A cinematic exploration of time, stillness, and human choices."
    }
  },
  {
    id: "winter-cirkliskis-2025",
    title: "WINTER | CIRKLIŠKIS",
    year: "2025",
    youtubeId: "UHx5LrClink",
    specs: "Cinematic Winter Study",
    desc: {
      lt: "Monochrominė žiemos ramybė ir dvaro apylinkių geometrija šaltoje šviesoje.",
      en: "Monochromatic winter stillness and heritage geometry captured in cold daylight."
    }
  },
  {
    id: "winter-sventa-2025",
    title: "WINTER | ŠVENTA",
    year: "2025",
    youtubeId: "XRJbHKVramA",
    specs: "Atmospheric Visual Poetry",
    desc: {
      lt: "Gryna gamtos ramybė, rūkas ir natūrali žiemos šviesa Šventos apylinkėse.",
      en: "Pure natural stillness, mist, and raw winter light in Šventa landscapes."
    }
  },
  {
    id: "winter-kauno-marios-2025",
    title: "WINTER | KAUNO MARIOS",
    year: "2025",
    youtubeId: "z02gKOaMJxw",
    specs: "Drone & Ground Cinematography",
    desc: {
      lt: "Ledo platybės, vėjo tekstūros ir Kauno marių žiemos horizontas.",
      en: "Frozen expanses, wind textures, and the stark winter horizon of Kauno Marios."
    }
  },
  {
    id: "winter-forest-2025",
    title: "WINTER | FOREST",
    year: "2025",
    youtubeId: "auGtquFMqBg",
    specs: "Deep Forest Mood",
    desc: {
      lt: "Miąško tyla, sniego šešėliai ir šviesos kontrastai tarp pušų kamienų.",
      en: "Forest silence, snow patterns, and deep contrast through the woodland canopy."
    }
  },
  {
    id: "the-village-kaimas-2024",
    title: "THE VILLAGE (KAIMAS)",
    year: "2024",
    youtubeId: "VIl8znMZYEA",
    specs: "Shot on Samsung A34",
    desc: {
      lt: "Dokumentinis kaimo gyvenimo ritmas, autentiški charakteriai ir nostalgiška tekstūra.",
      en: "Documentary rhythm of village life, authentic characters, and nostalgic texture."
    }
  },
  {
    id: "mikio-kelione-2024",
    title: "Mikio Kelionė",
    year: "2024",
    youtubeId: "qbA6W_XckMI",
    specs: "Narrative Short",
    desc: {
      lt: "Nuotaikingas ir vizualus pasakojimas apie mažo personažo didelę kelionę.",
      en: "A playful visual narrative following a character's journey through contrasting landscapes."
    }
  },
  {
    id: "nature-video-2024",
    title: "NATURE VIDEO",
    year: "2024",
    youtubeId: "ROSzuN4vsiE",
    specs: "Natural Lighting & Organic Movement",
    desc: {
      lt: "Vandens, vėjo ir lapų judėjimo detalės be dirbtinio apšvietimo.",
      en: "Textures of water, wind, and vegetation captured with organic ambient light."
    }
  },
  {
    id: "exit-2024",
    title: "EXIT",
    year: "2024",
    youtubeId: "buw2uCYHTfA",
    specs: "Cinematic Short",
    desc: {
      lt: "Trumpametražis filmas apie uždaras erdves, įtampą ir ieškomą išėjimą.",
      en: "Short film exploring claustrophobia, dramatic tension, and the quest for an exit."
    }
  },
  {
    id: "cirkliskis-2024",
    title: "Cirkliškis",
    year: "2024",
    youtubeId: "U9eYg2HCX08",
    specs: "Visual Exploration",
    desc: {
      lt: "Cirkliškio dvaro parko erdvės, architektūriniai elementai ir vasaros šviesotamsa.",
      en: "Cirkliškis manor grounds, architectural motifs, and midsummer chiaroscuro."
    }
  },
  {
    id: "ruduo-prie-gimnazijos-2024",
    title: "Ruduo Prie Gimnazijos",
    year: "2024",
    youtubeId: "779CwbrvWpA",
    specs: "Švenčionėlių Karaliaus Mindaugo gimnazija",
    desc: {
      lt: "Rudens spalvos, mokyklos aplinka ir jaunystės akimirkos Švenčionėliuose.",
      en: "Autumn colors, school grounds, and fleeting memories in Švenčionėliai."
    }
  }
];
