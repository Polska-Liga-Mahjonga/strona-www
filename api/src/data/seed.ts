import type { CmsContentItem } from "../lib/types.js";

type SeedItem = Omit<CmsContentItem, "id" | "createdAt" | "updatedAt">;

export const seedItems: SeedItem[] = [
  {
    type: "site-setting",
    slug: "organization",
    title: "Dane organizacji",
    excerpt: "Globalne ustawienia widoczne w serwisie",
    body: "Polska Liga Mahjonga",
    data: {
      tagline: "Zagrajmy w Riichi! I nie tylko",
      krs: "0000356035",
      nip: "5222954731",
      founded: "2010"
    },
    published: true,
    order: 1
  },
  {
    type: "event",
    slug: "warsaw-mahjong-tournament-2024",
    title: "Warsaw Mahjong Tournament 2024",
    excerpt: "Prestiżowy turniej Riichi Mahjong",
    body: "Turniej rozgrywany według regulaminu EMA, obejmuje rundy eliminacyjne i finał.",
    data: {
      date: "2024-12-15",
      time: "10:00 - 18:00",
      location: "Warszawa, ul. Przykładowa 10",
      maxParticipants: 64,
      feePln: 50,
      status: "open"
    },
    published: true,
    order: 1
  },
  {
    type: "event",
    slug: "riichi-mahjong-championship",
    title: "Riichi Mahjong Championship",
    excerpt: "Mistrzostwa Polski w Riichi Mahjong",
    body: "Najważniejsze wydarzenie roku dla polskich graczy Riichi Mahjong.",
    data: {
      date: "2025-01-20",
      time: "09:00 - 19:00",
      location: "Kraków, Centrum Kultury",
      maxParticipants: 80,
      status: "soon"
    },
    published: true,
    order: 2
  },
  {
    type: "event",
    slug: "turniej-dla-poczatkujacych",
    title: "Turniej Dla Początkujących",
    excerpt: "Idealne wydarzenie dla nowych graczy",
    body: "Przyjazny turniej dla osób zaczynających przygodę z Riichi Mahjong.",
    data: {
      date: "2025-02-10",
      time: "11:00 - 17:00",
      location: "Wrocław, Dom Kultury",
      maxParticipants: 32,
      status: "open"
    },
    published: true,
    order: 3
  },
  {
    type: "news",
    slug: "sukces-polskich-zawodnikow-ecm",
    title: "Sukces Polskich Zawodników na European Mahjong Championship",
    excerpt: "Polska reprezentacja zdobyła drugie miejsce w zawodach europejskich.",
    body: "To historyczny sukces dla polskiego mahjonga. Drużyna zaprezentowała wysoki poziom gry przez cały turniej.",
    imageUrl: "images/news1.jpg",
    data: {
      date: "2024-11-25",
      featured: true
    },
    published: true,
    order: 1
  },
  {
    type: "news",
    slug: "nowe-zajecia-dla-poczatkujacych",
    title: "Nowe Zajęcia dla Początkujących w Warszawie",
    excerpt: "Rozpoczynamy cykl warsztatów wprowadzających do gry.",
    body: "Zajęcia będą odbywać się regularnie i obejmą teorię oraz praktyczne rozgrywki.",
    imageUrl: "images/news2.jpg",
    data: {
      date: "2024-11-18",
      featured: false
    },
    published: true,
    order: 2
  },
  {
    type: "news",
    slug: "partnerstwo-z-wmo",
    title: "PLM Partnerem Oficjalnym World Mahjong Organization",
    excerpt: "Nawiązaliśmy partnerstwo z międzynarodową organizacją.",
    body: "Partnerstwo umacnia pozycję PLM na arenie międzynarodowej i wspiera rozwój społeczności.",
    imageUrl: "images/news3.jpg",
    data: {
      date: "2024-11-10",
      featured: false
    },
    published: true,
    order: 3
  },
  {
    type: "team",
    slug: "jan-kowalski",
    title: "Jan Kowalski",
    excerpt: "Prezes Zarządu",
    body: "Gracz mahjonga od 2008 roku. Współzałożyciel PLM.",
    data: {
      role: "Prezes Zarządu",
      group: "board"
    },
    published: true,
    order: 1
  },
  {
    type: "team",
    slug: "anna-nowak",
    title: "Anna Nowak",
    excerpt: "Wiceprezes",
    body: "Koordynuje wydarzenia i reprezentuje PLM podczas spotkań EMA.",
    data: {
      role: "Wiceprezes",
      group: "board"
    },
    published: true,
    order: 2
  },
  {
    type: "team",
    slug: "tomasz-kaminski",
    title: "Tomasz Kamiński",
    excerpt: "Koordynator Turniejów",
    body: "Nadzoruje turnieje krajowe i harmonogramy rozgrywek.",
    data: {
      role: "Koordynator Turniejów",
      group: "coordinators"
    },
    published: true,
    order: 10
  },
  {
    type: "page-section",
    slug: "home-hero",
    title: "Sekcja Hero",
    excerpt: "Nagłówek strony głównej",
    body: "Propagowanie Mahjonga w Polsce od 2010 roku",
    data: {
      page: "index",
      key: "hero"
    },
    published: true,
    order: 1
  }
];
