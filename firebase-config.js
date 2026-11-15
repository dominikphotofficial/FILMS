// ==========================================================================
// DP.FILMS — Firebase Configuration & Central Data Store
// Dominik Šuškevič — Filmmaker, Cinematographer & Editor
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

export const FIRESTORE_COLLECTION = "submissions";
export const STORAGE_FOLDER = "submissions";
export const ADMIN_EMAIL = "dominikphotofficial.lt@gmail.com";
export const NOTIFICATION_EMAIL = "info@dominikphotofficial.lt";
export const TRIGGER_EMAIL_FROM = "DP.FILMS <films@dominikphotofficial.lt>";
export const DP_LOGO_URL = "https://iili.io/fjNLbs4.png";

export const contactLinks = {
  email: "info@dominikphotofficial.lt",
  instagram: {
    label: "Instagram",
    handle: "@dominikphotofficial",
    url: "https://www.instagram.com/dominikphotofficial"
  },
  telegram: {
    label: "Telegram",
    handle: "@dominikphotofficial",
    url: "https://t.me/dominikphotofficial"
  },
  photographyPortfolio: "https://portfolio.dominikphotofficial.lt",
  festival: {
    name: "Ąžuolynas International Film Festival (KTG)",
    instagramUrl: "https://www.instagram.com/azuolynasfilmfestival",
    instagramHandle: "@azuolynasfilmfestival",
    websiteUrl: "https://azuolynasinternationalfilmfestival.github.io/"
  }
};

// Owner's films and visual works with verified YouTube IDs and accurate roles
export const filmsList = [
  {
    id: "frozen-time-what-if",
    title: "FROZEN TIME: WHAT IF",
    year: "2026",
    youtubeId: "bcLq-VXBpzI",
    award: {
      en: "1st Place, Student Category · 2026.04.30",
      lt: "I vieta studentų kategorijoje · 2026.04.30"
    },
    roles: {
      en: ["Director", "Screenwriter", "Producer", "Cinematography"],
      lt: ["Režisierius", "Scenarijus", "Prodiuseris", "Kinematografija"]
    },
    desc: {
      en: "Created for the Ąžuolynas International Film Festival at Kaunas International Gymnasium. Shot around Cirkliškis Manor.",
      lt: "Sukurtas specialiai „Ąžuolyno“ tarptautiniam kino festivaliui Kauno tarptautinėje gimnazijoje. Nufilmuotas Cirkliškio dvaro apylinkėse."
    },
    detailUrl: {
      en: "frozen-time.html",
      lt: "frozen-time.html"
    }
  },
  {
    id: "winter-cirkliskis-2025",
    title: "WINTER | CIRKLIŠKIS",
    year: "2025",
    youtubeId: "UHx5LrClink",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Winter visual study filmed around Cirkliškis.",
      lt: "Žiemos vaizdo darbas, nufilmuotas Cirkliškyje."
    }
  },
  {
    id: "winter-sventa-2025",
    title: "WINTER | ŠVENTA",
    year: "2025",
    youtubeId: "XRJbHKVramA",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Winter visual study filmed around Šventa.",
      lt: "Žiemos vaizdo darbas, nufilmuotas prie Šventos."
    }
  },
  {
    id: "winter-kauno-marios-2025",
    title: "WINTER | KAUNO MARIOS",
    year: "2025",
    youtubeId: "z02gKOaMJxw",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Winter visual study filmed at Kauno Marios.",
      lt: "Žiemos vaizdo darbas, nufilmuotas prie Kauno marių."
    }
  },
  {
    id: "winter-forest-2025",
    title: "WINTER | FOREST",
    year: "2025",
    youtubeId: "auGtquFMqBg",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Winter forest visual study.",
      lt: "Žiemos miško vaizdo darbas."
    }
  },
  {
    id: "the-village-kaimas-2024",
    title: "THE VILLAGE (KAIMAS)",
    year: "2024",
    youtubeId: "VIl8znMZYEA",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Visual study filmed in the countryside.",
      lt: "Kaimo aplinkos vaizdo darbas."
    }
  },
  {
    id: "mikio-kelione-2024",
    title: "Mikio Kelionė",
    year: "2024",
    youtubeId: "qbA6W_XckMI",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Short visual piece.",
      lt: "Trumpas vaizdo darbas."
    }
  },
  {
    id: "nature-video-2024",
    title: "NATURE VIDEO",
    year: "2024",
    youtubeId: "ROSzuN4vsiE",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Nature visual study.",
      lt: "Gamtos vaizdo darbas."
    }
  },
  {
    id: "exit-2024",
    title: "EXIT",
    year: "2024",
    youtubeId: "buw2uCYHTfA",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Short visual piece.",
      lt: "Trumpas vaizdo darbas."
    }
  },
  {
    id: "cirkliskis-2024",
    title: "Cirkliškis",
    year: "2024",
    youtubeId: "U9eYg2HCX08",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Visual study filmed at Cirkliškis.",
      lt: "Vaizdo darbas, nufilmuotas Cirkliškyje."
    }
  },
  {
    id: "ruduo-prie-gimnazijos-2024",
    title: "Ruduo Prie Gimnazijos",
    year: "2024",
    youtubeId: "779CwbrvWpA",
    roles: {
      en: ["Cinematography"],
      lt: ["Kinematografija"]
    },
    desc: {
      en: "Autumn visual study.",
      lt: "Rudens vaizdo darbas."
    }
  }
];

export const awardsData = [
  {
    year: "2026.04.30",
    title: {
      en: "FROZEN TIME: WHAT IF",
      lt: "FROZEN TIME: WHAT IF"
    },
    result: {
      en: "1st Place — Student Category",
      lt: "I vieta — Studentų kategorija"
    },
    place: {
      en: "Ąžuolynas International Film Festival, Kaunas International Gymnasium (KTG)",
      lt: "„Ąžuolyno“ tarptautinis kino festivalis, Kauno tarptautinė gimnazija (KTG)"
    },
    href: "frozen-time.html"
  }
];
