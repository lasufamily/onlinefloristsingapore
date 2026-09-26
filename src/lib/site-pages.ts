import faqEntries from '../data/faq.json';
import knowledgePages from '../data/knowledge-pages.json';
import { brand } from './brand';
import { optimizeDescription, optimizeTitle } from './seo';

export type CanonicalPage = {
  path: string;
  title: string;
  description: string;
};

const fixedPages: CanonicalPage[] = [
  {
    path: '/',
    title: `Singapore Flower Guides | ${brand.name}`,
    description: 'Choose better flowers for Singapore occasions, gifts, arrangements, plant care, and delivery decisions with practical local guidance.',
  },
  {
    path: '/faq/',
    title: `Flower questions and answers | ${brand.name}`,
    description: 'Browse practical Singapore flower questions about care, meanings, occasions, hampers, plants, delivery, and buying decisions.',
  },
  {
    path: '/contact/',
    title: `Contact Hyper Florist | Flower Enquiries Singapore`,
    description: `Send a flower enquiry to ${brand.name} with the occasion, date, delivery area, budget, recipient details, and message preferences.`,
  },
  {
    path: '/privacy/',
    title: `Privacy Notice | ${brand.name} Singapore`,
    description: `Read how ${brand.name} collects, uses, protects, and retains information submitted through flower enquiries and website analytics.`,
  },
];

export const canonicalPages: CanonicalPage[] = [
  ...fixedPages,
  ...knowledgePages.map(({ path, title, description, heading, intro }) => ({
    path,
    title: optimizeTitle(title, heading),
    description: optimizeDescription(description, intro),
  })),
  ...faqEntries.map(({ question, slug, answer }) => ({
    path: `/faq/${slug}/`,
    title: optimizeTitle(`${question} | ${brand.name}`, question),
    description: optimizeDescription(answer),
  })),
];
