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
    title: 'Singapore Flower Guides | Online Florist Singapore',
    description: 'Choose better flowers for Singapore occasions, gifts, arrangements, plant care, and delivery decisions.',
  },
  {
    path: '/faq/',
    title: 'Flower questions and answers | Online Florist Singapore',
    description: 'Browse practical questions about flower care, meanings, occasions, hampers, plants, and buying flowers.',
  },
  {
    path: '/contact/',
    title: 'Contact | Online Florist Singapore',
    description: 'Send a flower enquiry to Online Florist Singapore with your occasion, date, delivery area, and budget.',
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
