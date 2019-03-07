<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row store_dets_dir_btns">
        <div class="col directory_container">
          <router-link to="/stores">
            <div class="directory_btn caps">Stores</div>
          </router-link>
          <router-link to="/map">
            <div class="directory_btn caps">Centre Map</div>
          </router-link>
        </div>
      </div>
      <div class="margin_30"></div>
      <div class="row">
        <div class="col-md-6">
          <mapplic-map id="store_details" ref="mapplic_ref" :height="358" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="mapStores" :floorlist="floorList" tooltiplabel="View Store Details" @updateMap="updateSVGMap"></mapplic-map>
        </div>
        <div class="col-md-6 border_left">
          <div id="store_details_container">
            <div v-if="currentStore.store_logo"  class="store_details_logo">
              <img :src="currentStore.store_logo" :alt="currentStore.name + ' Logo'" />
            </div>
            <div class="store_details_info">
              <p v-if="currentStore.phone" class="center">
                <span class="store_details_highlight">Phone:</span> {{ currentStore.phone }}
              </p>
              <p v-if="currentStore.website" class="center">
                <a :href="currentStore.website" target="_blank">
                  <span class="store_details_highlight">Visit Store Website</span> 
                </a>
              </p>
              <p v-if="currentStore.category_list" class="center">
                <span class="store_details_highlight">Categories:</span>
                <span v-for="(item, index) in currentStore.category_list" :key="index">{{ item.name }}<span v-if="index != Object.keys(currentStore.category_list).length - 1">, </span></span>
              </p>
              <p v-if="currentStore.z_coordinate" class="center">
                <span class="store_details_highlight">Location:</span> Level {{ currentStore.z_coordinate }}
              </p>
            </div>
            <p v-if="currentStore.description" v-html="currentStore.description" class="store_details_description"></p>
          </div>
          <div v-if="storeHours" class="grey_line store_details_hours margin_60">
            <h2 class="details_title">Store Hours</h2>
            <div v-for="(item, index) in storeHours" :key="index" class="hours_div">
              <div class="day">{{ item.day_of_week | moment("dddd", timezone) }}:</div>
              <div class="time">
                <span v-if="item.is_closed">Closed</span>
                <span v-else>{{ item.open_time | moment("h:mm A", timezone)}} - {{ item.close_time | moment("h:mm A", timezone) }}</span>
              </div>
            </div>
          </div>
          <!-- PROMOTIONS -->
          <div v-if="storePromotions.length > 0" class="grey_line">
            <h2 class="details_title">Sales & Promotions</h2>
            <div v-for="(item, index) in storePromotions" :key="index" class="promo_container">
              <div class="promo_img_container" v-bind:style="{ backgroundImage: 'url(' + item.image_url + ')' }"></div>
              <div class="promo_content">
                <h3 class="promo_name">{{ item.name }}</h3>
                <h5 v-if="isMultiDay(item, timezone)" class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }} - {{ item.end_date | moment("MMMM D", timezone) }}</h5>
                <h5 v-else class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }}</h5>
                <p class="promo_desc">{{ item.desc_short }}</p>
                <a class="read_more" :href="'/promotions/' + item.slug">View Promotion Details</a>
              </div>
            </div>
          </div>
          <!-- CAREERS -->
          <div v-if="storeJobs.length > 0" class="grey_line">
            <h2 class="details_title">Job Opportunities</h2>
            <div v-for="(item, index) in storeJobs" :key="index" class="jobs_container">
              <div class="promo_content">
                <h3 class="promo_name">{{ item.name }}</h3>
                <h5 v-if="isMultiDay(item, timezone)" class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }} - {{ item.end_date | moment("MMMM D", timezone) }}</h5>
                <h5 v-else class="promo_dates">{{ item.start_date | moment("MMMM D", timezone) }}</h5>
                <a class="read_more" :href="'/jobs/' + item.slug"><p>Read More</p></a>
              </div> 
            </div>
          </div>
        </div>
      </div>
      <div class="margin_30"></div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import tz from 'moment-timezone'
  import { mapGetters } from 'vuex'
  import MapplicMap from '~/components/Mapplic.vue'

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
      MapplicMap
    },
    data() {
      return {
        tempSEO: null,
        currentSEO: {},
        currentStore: {},
        page_name: "",
        storeHours: [],
        storePromotions: [],
        storeJobs: []
      };
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath }),
          store.dispatch("getData", { resource: "categories" })
        ]);
        return { tempSEO: results[0].data.meta_data[0] }
      } catch (e) {
        console.log(e.message);  
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.updateCurrentStore(this.$route.params.slug);
      });
      next();
    },
    mounted() {
      this.getSVGMap;
    },
    created() {
      this.updateCurrentStore(this.$route.params.slug);
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'findRepoByName',
        'processedStores',
        'findStoreBySlug',
        'processedCategories',
        'findCategoryById',
        'findHourById',
        'findPromoById',
        'findJobById'
      ]),
      mapStores() {
        var all_stores = this.processedStores;
        _.forEach(all_stores, function(value, key) {
          value.zoom = 2;
          if(value.svgmap_region == null){
            value.svgmap_region = value.id;
          }
        });
        return all_stores;
      },
      storeNames () {
        return _.map(this.processedStores, 'name');
      },
      getSVGMap(){
        var map_url = "//mallmaverick.com" + this.property.svgmap_url;  
        map_url = _.split(map_url, '?');
        map_url = map_url[0];
        return map_url;
      },
      floorList () {
        var floor_list = [];
        var floor_1 = {};
        floor_1.id = "first-floor";
        floor_1.title = "Level One";
        floor_1.map = this.getSVGMap;
        floor_1.z_index = null;
        floor_1.show = true;
        floor_list.push(floor_1);
        
        return floor_list;
      }
    },
    methods: {
      updateCurrentStore(slug) {
        this.$nextTick(function() {
          this.currentStore = this.findStoreBySlug(slug);
          if (this.currentStore === null || this.currentStore === undefined){
            this.$router.replace({ path: '/stores'});
          } else {
            var vm = this;
            // STORE NAME
            this.page_name = this.currentStore.name;
            // STORE LOGO
            if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
              this.currentStore.no_logo = true
            } else {
              this.currentStore.no_logo = false;
              this.currentStore.store_logo = this.currentStore.store_front_url_abs;
            }
            // STORE CATEGORIES
            var store_categories = this.currentStore.categories;
            if (store_categories != null && store_categories.length > 0) {
              var category = "";
              var category_list = [];
              _.forEach(store_categories, function(value, key) {
                category = vm.findCategoryById(value);
                category_list.push(category)
              });
              if (category_list.length) {
                this.currentStore.category_list = category_list;
              }
            }

            // STORE WEBSITE 
            // if (this.currentStore.website) {
            //   this.currentStore.website = "http://" + this.currentStore.website
            // }

            // STORE HOURS
            var storeHours = [];
            var store_hours = this.currentStore.store_hours;
            if (store_hours) {
              _.forEach(store_hours, function (value, key) {
                var hours = vm.findHourById(value);
                var today = moment().day();
                if (today == hours.day_of_week) {
                  hours.todays_hours = true;
                } else {
                  hours.todays_hours = false;
                }
                storeHours.push(hours);
              });
              this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
            }
            
            // PROMOTIONS
            var temp_promo = [];
            var promos = this.currentStore.promotions;
            _.forEach(promos, function(value, key) {
              var current_promo = vm.findPromoById(value);
              if (_.includes(current_promo.promo_image_url_abs, 'missing')) {
                current_promo.image_url = "https://placehold.it/1560x800/757575";
              } else {
                current_promo.image_url = current_promo.promo_image_url_abs;
              }
              
              current_promo.desc_short = _.truncate(current_promo.description, { 'length': 250, 'separator': ' ' });
              
              temp_promo.push(current_promo);
            }); 
            this.storePromotions = temp_promo;

            // JOBS 
            var temp_jobs = [];
            var jobs = this.currentStore.jobs;
            _.forEach(jobs, function(value, key) {
              var current_job = vm.findJobById(value);
              temp_jobs.push(current_job);
            });
            this.storeJobs = temp_jobs;
          }
        });
      },
      dropPin(store) {
        this.$refs.mapplic_ref.showLocation(store.svgmap_region);
      },
      updateSVGMap(map) {
        this.map = map;
        this.dropPin(this.currentStore);
      }
    }
  };
</script>
