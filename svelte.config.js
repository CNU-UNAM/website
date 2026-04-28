import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      crawl: false,
      entries: ['/', '/nosotros', '/faq', '/login', '/oportunidades', '/signup']
    }
  }
};