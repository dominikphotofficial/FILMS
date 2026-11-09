// ==========================================================================
// DP | FILMS — Awards & Recognition Data Store
// Dominik Šuškevič — Certified Videographer, Photographer & Filmmaker
// ==========================================================================

export const awardsCategories = [
  { id: "festival", title: { en: "Festival Awards", lt: "Festivalių apdovanojimai" } },
  { id: "nominations", title: { en: "Nominations", lt: "Nominacijos" } },
  { id: "selections", title: { en: "Official Selections", lt: "Oficiali atranka" } },
  { id: "recognition", title: { en: "Other Recognition", lt: "Kitas pripažinimas" } }
];

export const awardsList = [
  {
    id: "frozen-time-aisff-1st",
    category: "festival",
    year: "2026",
    title: {
      en: "1st Place Winner — Best Short Film",
      lt: "1-oji vieta — Geriausias trumpametražis filmas"
    },
    festival: {
      en: "Ąžuolynas International Student Film Festival (AISFF 2026)",
      lt: "Ąžuolyno tarptautinis studentų kino festivalis (AISFF 2026)"
    },
    film: "FROZEN TIME: WHAT IF",
    filmSlug: "frozen-time",
    filmUrl: "/awards/frozen-time/",
    role: {
      en: "Directed, Shot & Edited by Dominik Šuškevič",
      lt: "Režisūra, kinematografija ir montažas: Dominik Šuškevič"
    },
    badge: "1st Place · First Prize",
    description: {
      en: "Awarded first place among international youth films. Recognized by the jury for atmospheric cinematography, precise rhythm, and philosophical handling of stillness and existential choice.",
      lt: "Pelnyta pirmoji vieta tarp tarptautinių jaunimo filmų. Įvertintas žiuri už atmosferišką kinematografiją, precizišką ritmą ir filosofinę laiko analizę."
    },
    festivalLink: "https://azuolynasinternationalfilmfestival.github.io/",
    instagramLink: "https://www.instagram.com/azuolynasfilmfestival"
  },
  {
    id: "certified-videographer-qualification",
    category: "recognition",
    year: "2025",
    title: {
      en: "Certified Videographer & Camera Operator",
      lt: "Sertifikuotas videografas ir kameros operatorius"
    },
    festival: {
      en: "Professional Vocational Accreditation · Lithuania",
      lt: "Profesinė kvalifikacinė akreditacija · Lietuva"
    },
    film: "Cinematography & Visual Arts",
    role: {
      en: "Certified Qualification",
      lt: "Patvirtinta kvalifikacija"
    },
    badge: "Certified Credential",
    description: {
      en: "Officially certified in professional camera operation, natural lighting composition, audio capturing, and digital post-production.",
      lt: "Oficialiai patvirtinta profesinė kvalifikacija videografijos, šviesos valdymo, kompozicijos bei post-produkcijos srityje."
    }
  }
];

export function getAwardsByCategory(categoryId) {
  return awardsList.filter(a => a.category === categoryId);
}
