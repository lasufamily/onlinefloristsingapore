import faqEntries from '../data/faq.json';
import knowledgePages from '../data/knowledge-pages.json';

export type CanonicalPage = {
  path: string;
  title: string;
  description: string;
};

const fixedPages: CanonicalPage[] = [
  {
    path: '/',
    title: 'Flower knowledge for Singapore | Online Florist Singapore',
    description: 'Learn how to choose, care for, arrange, and gift flowers in Singapore before deciding what to buy.',
  },
  {
    path: '/faq/',
    title: 'Flower questions and answers | Online Florist Singapore',
    description: 'Browse practical questions about flower care, meanings, occasions, hampers, plants, and buying flowers.',
  },
  {
    path: '/contact/',
    title: 'Contact | Online Florist Singapore',
    description: 'Contact Online Florist Singapore about corrections, partnerships, and flower knowledge resources.',
  },
  {
    path: '/privacy/',
    title: 'Privacy | Online Florist Singapore',
    description: 'Read how Online Florist Singapore handles enquiry and website data.',
  },
];

export const canonicalPages: CanonicalPage[] = [
  ...fixedPages,
  ...knowledgePages.map(({ path, title, description }) => ({ path, title, description })),
  ...faqEntries.map(({ question, slug, answer }) => ({
    path: `/faq/${slug}/`,
    title: `${question} | Online Florist Singapore`,
    description: answer,
  })),
];
