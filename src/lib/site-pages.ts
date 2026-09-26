import faqEntries from '../data/faq.json';
import knowledgePages from '../data/knowledge-pages.json';
import { brand } from './brand';

export type CanonicalPage = {
  path: string;
  title: string;
  description: string;
};

const fixedPages: CanonicalPage[] = [
  {
    path: '/',
    title: `Singapore Flower Guides | ${brand.name}`,
    description: 'Choose better flowers for Singapore occasions, gifts, arrangements, plant care, and delivery decisions.',
  },
  {
    path: '/faq/',
    title: `Flower questions and answers | ${brand.name}`,
    description: 'Browse practical questions about flower care, meanings, occasions, hampers, plants, and buying flowers.',
  },
  {
    path: '/contact/',
    title: `Contact | ${brand.name}`,
    description: `Send a flower enquiry to ${brand.name} with your occasion, date, delivery area, and budget.`,
  },
  {
    path: '/privacy/',
    title: `Privacy | ${brand.name}`,
    description: `Read how ${brand.name} handles enquiry and website data.`,
  },
];

export const canonicalPages: CanonicalPage[] = [
  ...fixedPages,
  ...knowledgePages.map(({ path, title, description }) => ({ path, title, description })),
  ...faqEntries.map(({ question, slug, answer }) => ({
    path: `/faq/${slug}/`,
    title: `${question} | ${brand.name}`,
    description: answer,
  })),
];
