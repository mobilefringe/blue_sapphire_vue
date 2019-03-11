<template>
	<div>
    <inside-page-banner :page_name="page_name" />
		<div class="container">
      <div class="row" v-if="searchResultsList && searchResultsList.length > 0">
        <div class="col-sm-12">
          <p class="search_result_title">Found {{ searchResultsList.length }} results matching "{{ searchQuery }}".</p>
        </div>
        <div class="col-sm-12">
          <div v-for="(result,index) in searchResultsList" :key="index">
            <div class="row result_container">
              <div v-if="result.is_store" class="col-sm-2 store_details_image center-block">
                <div v-if="checkMissingImage(result)">
                  <div class="no_logo">
                    <img class="max-width" src="//codecloud.cdn.speedyrails.net/sites/5b88438d6e6f641e8d3c0000/image/png/1536092029690/transparent_logo.png" alt="">
                    <p class="store_details_name">
                      <span v-if="result.store_front_url_abs">{{result.name}}</span>
                      <span v-else>{{ result.store.name }}</span>
                    </p>
                  </div>    
                </div> 
                <div v-else>
                  <img v-if="result.store" class="max-width" :src="result.store.store_front_url_abs" :alt="result.store.name + ' Logo'"/>
                  <img v-else-if="result.store_front_url_abs" class="max-width" :src="result.store_front_url_abs" :alt="result.name + ' Logo'" />
                </div>
              </div>
              <div v-else class="col-sm-2 store_details_image center-block">
                <img class="max-width" src="https://www.mallmaverick.com/system/site_images/photos/000/044/637/original/default_logo.png?1539618404" alt=""/>    
              </div>
              <div class="col-sm-10 search_result_content">
                <h3 class="search_results_name">{{ result.name }}</h3>
                <p>{{ truncate(result.description, 150) }}</p>
                <nuxt-link v-if="result.store_front_url_abs" class="read_more" :to="{ name: 'stores-slug', params:{ slug:result.slug }}">
                  View Store Details
                </nuxt-link>
                <nuxt-link v-else-if="result.promo_image_url_abs" class="read_more" :to="{ name: 'promotions-slug', params:{ slug:result.slug }}">
                  View Promotions Details
                </nuxt-link>
                <nuxt-link v-else-if="result.event_image_url_abs" class="read_more" :to="{ name: 'eventDetails'} ">
                  View Event Details
                </nuxt-link>
                <nuxt-link v-else-if="result.jobable_id" class="read_more" :to="{ name: 'jobs-slug', params: { slug: result.slug }} ">
                  View Job Details
                </nuxt-link>
              </div>
            </div>                
          </div>
        </div>
		  </div>
      <div class="page_container text-left no_search_results margin_30" v-else> 
        <h3>Sorry, there are no search results. Please try a different query.</h3>
      </div>
    </div>
	</div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    head() {
      return {
        title: this.currentSEO.meta_title,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.currentSEO.meta_description
          },
          {
            hid: "keywords",
            name: "keywords",
            content: this.currentSEO.meta_keywords
          },
          {
            hid: "image",
            name: "image",
            content: this.currentSEO.image
          }
        ]
      }
    },
    transition: "page",
    components: {
      insidePageBanner: () => import("~/components/insidePageBanner.vue"),
    },
    data() {
      return {
        tempSEO: null,
        currentSEO: {},
        page_name: "Search Results",
        searchResultsList: null,
        searchQuery: null,
      };
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", {  url: route.fullPath })
        ]);
        return { tempSEO: results[0].data.meta_data[0] };
      } catch (e) {
        console.log(e.message);
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.updateResults();
      });
      next();
    },
    created() {
      this.updateResults();
      if (this.searchResultsList == null || this.searchResultsList == undefined) {
        // this.$router.push("/");
      }
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
    },
    computed: {
      ...mapGetters([
        "property",
        "searchResults"
      ])
    },
    methods: {
      updateResults() {
        if (
          this.$route.query.searchQuery !== null &&
          this.$route.query.searchQuery !== undefined &&
          this.$route.query.searchQuery.length > 0
        ) {
          if (
            this.searchResults !== null &&
            this.searchResults !== undefined &&
            Array.isArray(this.searchResults)
          ) {
            this.searchResultsList = this.searchResults;
            this.searchQuery = this.$route.query.searchQuery;
          }
        }
      },
      checkMissingImage(result) {
        if (result.store) {
          return _.includes(result.store.store_front_url_abs, "missing");
        } else {
          return false;
        }
      }
    }
  };
</script>