<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row"> 
        <div class="col-md-12">
          <h3 class="promo_details_name">{{ currentPromo.name }}</h3>
          <h5 v-if="isMultiDay(currentPromo, timezone)" class="promo_dates">{{ currentPromo.start_date | moment("MMMM D", timezone) }} - {{ currentPromo.end_date | moment("MMMM D", timezone) }}</h5>
          <h5 v-else class="promo_dates">{{ currentPromo.start_date | moment("MMMM D", timezone) }}</h5>
          <hr class="horizontal_div">
          <img class="promo_details_img" :src="currentPromo.image_url" :alt="currentPromo.name" />
          <div class="promo_desc details" v-html="currentPromo.rich_description"></div>
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
        currentPromo: {},
        page_name: ""
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
        this.updateCurrentPromo(this.$route.params.slug);
      });
      next();
    },
    mounted() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }

      this.updateCurrentPromo(this.$route.params.slug);
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'findPromoBySlug'
      ])
    },
    methods: {
      updateCurrentPromo(slug) {
        this.$nextTick(function() {
          this.currentPromo = this.findPromoBySlug(slug);
          if (this.currentPromo === null || this.currentPromo === undefined){
            this.$router.replace({ name: 'promotions'});
          } else {
            if (this.currentPromo.store != null || this.currentPromo.store != undefined) {
              this.page_name = this.currentPromo.store.name;
            } else {
              this.page_name = this.property.name;
            }

            if (_.includes(this.currentPromo.promo_image_url_abs, 'missing')) {
              this.currentPromo.image_url = "https://codecloud.cdn.speedyrails.net/sites/5bbfac0c6e6f6411b3040000/image/png/1546551307522/eventplaceholder2@2x.png"
            } else {
              this.currentPromo.image_url = this.currentPromo.promo_image_url_abs;
            }
          }
        });
      }
    }
  }
</script>