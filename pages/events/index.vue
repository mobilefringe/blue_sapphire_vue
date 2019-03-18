<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row"> 
        <div v-for="(item, index) in events" :key="index" v-if="showMore > index" class="col-md-6 col-lg-4 promo_container">
          <div class="promo_img_container" v-bind:style="{ backgroundImage: 'url(' + item.image_url + ')' }"></div>
          <div class="promo_content">
            <h3 class="promo_name">{{ item.name_short }}</h3>
            <h5 v-if="isMultiDay(item, timezone)" class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }} - {{ item.end_date | moment("MMMM D", timezone) }}</h5>
            <h5 v-else class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }}</h5>
            <p class="promo_desc">{{ item.desc_short }}</p>
            <nuxt-link class="read_more" :to="{ name: 'events-slug', params: { slug: item.slug }}">
              <span>View Event Details</span>
            </nuxt-link>
          </div>
        </div>
        <div class="col">
          <div class="animated_btn" v-if="events && showMore < events.length" @click="loadMore()">Load More</div>
          <p v-if="events.length === 0">There are no Events posted at this time. Please check back soon.</p>
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
        page_name: "Events",	
        incrementBy: 3,
        showMore: 6,
      }
    },
    async asyncData({ store, params }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", { url: "/events" }),
          // store.dispatch("getData", { resource: "repos" })
        ]);
        return { tempSEO: results[0].data.meta_data[0] };
      } catch (e) {
        console.log(e.message);
      }
    },
    created() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'processedEvents',
        'findRepoByName'
      ]),
      events() {
        var events = this.processedEvents;
        var vm = this;
        var timezone = this.timezone;
        var temp_event = [];
        _.forEach(events, function(value, key) {
          var today = moment.tz(timezone).format();
          var showOnWebDate = moment.tz(value.show_on_web_date, timezone).format();
          if (today >= showOnWebDate) {
            if (_.includes(value.event_image_url_abs, 'missing')) {
              var default_img = vm.defaultImage;
              if (default_img) {
                value.image_url = default_img.image_url;
              } else {
                value.image_url = "https://via.placeholder.com/700x410/888888/FFFFFF/?text=No+Image"
              }
            } else {
              value.image_url = value.event_image_url_abs;
            }

            if (value.name.length > 30) {
              value.name_short = _.truncate(value.name, { 'length': 30, 'separator': ' ' });
            } else {
              value.name_short = value.name;
            }
            
            if (value.description.length > 100) {
              value.desc_short = _.truncate(value.description, { 'length': 100, 'separator': ' ' });
            } else {
              value.desc_short = value.description;
            }
          
            temp_event.push(value);
          }
        });
        temp_event = _.sortBy(temp_event, [function(o) { return o.end_date; }]);
        return temp_event;
      },
      defaultImage() {
        var repo = this.findRepoByName("Default Image").images;
        if (repo) {
          var default_img = repo[0];
          return default_img
        }
      }
    },
    methods: {
      loadMore() {
        if (this.showMore <= this.events.length) {
          var num = this.showMore + this.incrementBy;
          this.showMore = num;
        }
      }
    }
  }
</script>