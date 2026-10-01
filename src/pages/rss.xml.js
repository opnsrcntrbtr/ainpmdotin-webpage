import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: 'AINPM.in — AI-native product management from India',
    description: 'Answer-first guides for AI-native product managers in India, by Ian Pinto.',
    site: context.site,
    trailingSlash: true,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: `/articles/${a.id}/`,
      author: 'Ian Pinto',
      categories: a.data.tags,
    })),
    customData: '<language>en-in</language>',
  });
}
