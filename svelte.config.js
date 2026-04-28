import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter(),
    prerender: {
      crawl: false,
      entries: ['/', '/other-page-you-want'] // list only pages you want prerendered
    }
  }
};