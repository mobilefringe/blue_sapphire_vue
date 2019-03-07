const pkg = require('./package')

const webpack = require('webpack')
const axios = require('axios')
const API_URL = "https://mallmaverick.com/api/v4/cornwall"
const MM_HOST = "https://cornwall.mallmaverick.com"

module.exports = {
  mode: 'spa',
  /* Headers of the page */
  head: {
    title: "Blue Sapphire Template",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/vue2-animate@1.0.4/dist/vue2-animate.min.css' }
    ]
  },

  /* Set your environment variables here */
  env: {
    API_URL: API_URL,
    MM_HOST: MM_HOST
  },

  /* Customize the progress-bar color */
  loading: { 
    color: '#FFFFFF', 
    height: '5px' 
  },

  /* Custom loading page */

  /*
  loadingIndicator: {
    name: '~/assets/loading.html',
    color: '#000',
    background: 'white'
  },
  */

  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
    },
  },

  /* Global CSS */
css: [
  '~/assets/stylesheets/main.scss'
  ],

  /* Plugins to load before mounting the App */
plugins: [
    '~/plugins/es6-shim.js',
    '~/plugins/init-data.js',
    '~/plugins/vue-moment.js',
    '~/plugins/vee-validate.js',
    {
      src: '~/plugins/vue-masonry',
      ssr: false
    },
    '~/plugins/helper.js'
  ],

  /* Nuxt.js modules */
  modules: [,
    'bootstrap-vue/nuxt',
    'nuxt-vuex-router-sync',
    '@nuxtjs/font-awesome', 
    '@nuxtjs/google-analytics',
    '@nuxtjs/sitemap'  
  ],

  /* Google Analytics */ 
 'google-analytics': {
    id: 'needCode'
  },
 
  /*  Sitemap Configuration */
  sitemap: {
    generate: true,
    routes() {
      return axios.get(API_URL + '/seo.json')
        .then(res => res.data.meta_data.filter(md => { 
          if (md.path != null && md.path != undefined) return true 
        }).map(md => md.path).sort().map((currRoute) => {
          return {  
            url: currRoute,
            changefreq: 'daily',
            priority: 1,
            lastmodISO: new Date().toISOString()
          }
        }))
    }
  },

  /* Build configuration */
  build: {
    /* You can extend webpack config here */
    extend(config, ctx) {
      
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        _: 'lodash'
        // ...etc.
      })
    ],
    vendor: ['axios', 'jquery', 'lodash', 'fuse.js', 'moment', 'moment-timezone', 'vee-validate', 'vue-slick', 'vue-social-sharing', 'smoothscroll-polyfill', 'vue-select', 'es6-shim']
  }
}
