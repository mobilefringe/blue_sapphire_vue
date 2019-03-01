<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row"> 
        <div class="col-md-12">
          <h3 class="promo_details_name">{{ currentEvent.name }}</h3>
          <h5 v-if="isMultiDay(currentEvent, timezone)" class="promo_dates">{{ currentEvent.start_date | moment("MMMM D", timezone) }} - {{ currentEvent.end_date | moment("MMMM D", timezone) }}</h5>
          <h5 v-else class="promo_dates">{{ currentEvent.start_date | moment("MMMM D", timezone) }}</h5>
          <img class="promo_details_img" :src="currentEvent.image_url" :alt="currentEvent.name" />
          <hr class="horizontal_div">
          <p class="promo_details_desc" v-html="currentEvent.rich_description"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment"
  import tz from "moment-timezone"
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
      };
    },
    transition: "page",
    components: {
      insidePageBanner: () => import("~/components/insidePageBanner.vue"),
    },
    data: function data() {
      return {
        tempSEO: null,
        currentSEO: {},
        page_name: "",
        currentEvent: {},
      }
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", { url: route.fullPath })
        ]);
        return { tempSEO: results[0].data.meta_data[0] };
      } catch (e) {
        console.log(e.message);
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.updateCurrentEvent(this.$route.params.slug);
      });
      next();
    },
    mounted() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }

      this.updateCurrentEvent(this.$route.params.slug);
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'processedEvents',
        'findEventBySlug'
      ])
    },
    methods: {
      updateCurrentEvent(slug) {
        this.currentEvent = this.findEventBySlug(slug);
        if (this.currentEvent === null || this.currentEvent === undefined){
          this.$router.replace({ name: 'events'});
        } else {
          this.page_name = this.property.name;

          if (_.includes(this.currentEvent.event_image_url_abs, 'missing')) {
            this.currentEvent.image_url = "https://codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/png/1546551307522/eventplaceholder2@2x.png"
          } else {
            this.currentEvent.image_url = this.currentEvent.event_image_url_abs;
          }
        }
      }
    }
  }
</script>