export const SITE = {
  name: 'AINPM.in',
  url: 'https://ainpm.in',
  tagline: 'AI-native product management, built from India',
  description:
    'AINPM.in is a practical, India-first guide to AI-native product management by Ian Pinto, with a live open-source case study: SEBI Circular RAG.',
  locale: 'en-IN',
  goatcounter: 'https://ainpmdotin.goatcounter.com',
  // Google Calendar appointment schedule (Google Workspace, ianpinto@ainpm.in)
  booking:
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ00dNiqYT_nZaKJHxPnDtd02QKFXNNuIr8r564Kww0XOIw_yKW0Y0OQ62TTQJpILI2FZri55l8c',
  // Paste verification codes from Google Search Console / Bing Webmaster Tools here.
  googleVerification: '',
  bingVerification: '',
};

export const AUTHOR = {
  name: 'Ian Pinto',
  url: 'https://ainpm.in/about/',
  jobTitle: 'Technical Product / Program Manager',
  email: 'ianpinto@ainpm.in',
  description:
    'Technical Product / Program Manager working on mutual fund AMC products and platforms, cloud-native systems, RAG and agentic AI.',
  sameAs: [
    'https://www.linkedin.com/in/ian1980/',
    'https://github.com/opnsrcntrbtr',
    'https://huggingface.co/opnsrcntrbtrian',
  ],
  knowsAbout: [
    'AI-native product management',
    'Retrieval-augmented generation',
    'Agentic AI',
    'LLM evaluation',
    'Mutual fund platforms',
    'SEBI regulation',
    'Cloud-native systems',
  ],
};

export const NAV = [
  { href: '/sebi-rag/', label: 'SEBI RAG' },
  { href: '/articles/', label: 'Articles' },
  { href: '/glossary/', label: 'Glossary' },
  { href: '/#playbook', label: 'Playbook' },
  { href: '/#radar', label: 'Regulation' },
  { href: '/about/', label: 'About' },
  { href: '/consult/', label: 'Book a call', cta: true },
];

export const personSchema = {
  '@type': 'Person',
  '@id': 'https://ainpm.in/about/#ian-pinto',
  name: AUTHOR.name,
  url: AUTHOR.url,
  jobTitle: AUTHOR.jobTitle,
  email: 'mailto:' + AUTHOR.email,
  description: AUTHOR.description,
  sameAs: AUTHOR.sameAs,
  knowsAbout: AUTHOR.knowsAbout,
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': 'https://ainpm.in/#website',
  name: SITE.name,
  alternateName: 'AI Native Product Management India',
  url: SITE.url + '/',
  description: SITE.description,
  inLanguage: 'en-IN',
  publisher: { '@id': 'https://ainpm.in/about/#ian-pinto' },
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE.url + it.path,
    })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
