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
    title: `Contact Hyper Florist | Singapore Flower Guide`,
    description: `Contact ${brand.name} with questions, feedback, corrections, collaboration notes, or general messages for the Singapore flower guide team.`,
  },
  {
    path: '/about/',
    title: 'About Us',
    description: `${brand.name} is a Singapore editorial guide for flower gifting, fresh flower care, plant ideas, and practical local floral advice.`,
  },
  {
    path: '/privacy/',
    title: `Privacy Notice | ${brand.name} Singapore`,
    description: `Read how ${brand.name} handles contact form details, service provider processing, retention, privacy requests, and website analytics.`,
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
