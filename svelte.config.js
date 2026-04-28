// after
import netlify from '@sveltejs/adapter-netlify';

// svelte.config.js
export default {
  kit: {
    adapter: netlify(),
    prerender: {
      entries: ['/', '/about'] // list pages you actually want prerendered
    }
  }
};
