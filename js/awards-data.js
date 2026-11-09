// ==========================================================================
// DP | FILMS — Awards & Recognitions Data Source
// Reusable dataset grouped into categories for easy addition of future awards
// ==========================================================================

export const awardsData = [
  {
    category: "festival_awards",
    categoryTitle: {
      en: "Festival Awards",
      lt: "Festivalių apdovanojimai"
    },
    items: [
      {
        id: "frozen-time-aisff-2026",
        title: "FROZEN TIME: WHAT IF",
        awardName: {
          en: "1st Place Winner — Best Short Film",
          lt: "1-oji vieta — Geriausias trumpametražis filmas"
        },
        festival: "Ąžuolynas International Student Film Festival (AISFF 2026)",
        year: "2026",
        location: "Kaunas, Lithuania",
        role: "Director, Cinematographer, Editor",
        filmSlug: "frozen-time.html",
        filmPageUrl: "awards/frozen-time.html",
        youtubeId: "bcLq-VXBpzI",
        summary: {
          en: "Recognized with the 1st Place Trophy for excellence in visual narrative, temporal rhythm, and evocative winter cinematography.",
          lt: "Apdovanotas 1-osios vietos taure už vizualinį pasakojimą, laiko tėkmės ritmiką ir įtaigią žiemos kinematografiją."
        },
        festivalUrl: "https://azuolynasinternationalfilmfestival.github.io/"
      }
    ]
  },
  {
    category: "nominations",
    categoryTitle: {
      en: "Nominations",
      lt: "Nominacijos"
    },
    items: [] // Empty will display "Coming soon / Netrukus"
  },
  {
    category: "official_selections",
    categoryTitle: {
      en: "Official Selections",
      lt: "Oficialios atrankos"
    },
    items: [
      {
        id: "frozen-time-selection-2026",
        title: "FROZEN TIME: WHAT IF",
        awardName: {
          en: "Official Competition Selection",
          lt: "Oficiali konkursinė programa"
        },
        festival: "Ąžuolynas International Student Film Festival (AISFF 2026)",
        year: "2026",
        location: "Lithuania",
        role: "Director / DP",
        filmSlug: "frozen-time.html",
        filmPageUrl: "awards/frozen-time.html",
        youtubeId: "bcLq-VXBpzI",
        summary: {
          en: "Selected for the national student competition screening program.",
          lt: "Atrinktas į nacionalinės studentų konkursinės programos peržiūras."
        }
      }
    ]
  },
  {
    category: "other_recognition",
    categoryTitle: {
      en: "Other Recognition",
      lt: "Kiti įvertinimai"
    },
    items: [
      {
        id: "visual-arts-recognition-2025",
        title: "Cinematic Studies (2024–2025)",
        awardName: {
          en: "Young Filmmaker Portfolio Distinction",
          lt: "Jaunojo kūrėjo kinematografinis pripažinimas"
        },
        festival: "DP | Independent Visual Studies",
        year: "2024–2025",
        location: "Švenčionėliai / Vilnius, Lithuania",
        role: "Cinematographer & Editor",
        summary: {
          en: "Over 11 released narrative and atmospheric short film studies exploring natural lighting, space, and human emotion.",
          lt: "Virš 11 išleistų kinematografinių studijų tiriant natūralų apšvietimą, erdvę ir žmogaus emociją."
        }
      }
    ]
  }
];
