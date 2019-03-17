<template>
  <div> <!-- template will not render without an outer container -->
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row">
        <div class="col directory_container">
          <div id="alphaSort" class="directory_btn caps" @click="filterByCategory()">Alphabetical</div>
          <div class="directory_btn">
            <v-select v-model="selectedCategory" :options="categorySelect" :searchable="false" :on-change="filterByCategory" placeholder="Categories" class="category-select" id="selectByCatDesktop"></v-select>
            <v-select v-model="selectedCategoryMobile" :options="categorySelectMobile" :searchable="false" :on-change="filterByCategory" placeholder="Sort By" class="category-select" id="selectByCatMobile"></v-select>
          </div>
          <div id="centreMap">
            <router-link to="/map"> 
              <div class="directory_btn caps">Centre Map</div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col store_list_container">
          <div v-masonry transition-duration="0.3s" item-selector=".stores-grid-item" horizontal-order="true">
            <div v-masonry-tile v-for="(item, index) in filteredStores" :key="index" class="stores-grid-item">
              <div class="store_logo_container">
                <nuxt-link :to="{ name: 'stores-slug', params: { slug: item.slug } }">
                  <div v-if="!item.no_store_logo">
                    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                    <img  class="store_img" :src="item.store_front_url_abs" :alt="item.name + ' Logo'">
                  </div>   			
                  <div v-else class="no_logo_container">
                    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                    <div class="no_logo_text">
                      <div class="store_text">
                        <h5>{{ item.name }}</h5>
                      </div>
                    </div>
                  </div>
                  <div class="store_tag" v-if="item.total_published_promos">
                    <div class="store_tag_text">Promotion</div>
                  </div>
                  <div class="store_tag" v-if="!item.total_published_promos && item.is_coming_soon_store">
                    <div class="store_tag_text">Coming Soon</div>
                  </div>
                  <div class="store_tag" v-if="!item.total_published_promos && !item.is_coming_soon_store && item.is_new_store">
                    <div class="store_tag_text">New Store</div>
                  </div>
                  <div class="store_details">
                    <div class="store_text">
                      <h5>{{ item.name }}</h5>
                    </div>    
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
  import { mapGetters } from "vuex";
  import moment from "moment";
  import tz from "moment-timezone";

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
      VSelect: () => import('vue-select')
    },
    data() {
      return {
        tempSEO: null,
        currentSEO: {},
        page_name: "Store Directory",
        selectedCategory: "Categories",
        selectedCategoryMobile: "Sort By",
        filteredStores: null
      };
    },
    async asyncData({ store, params }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", { url: "/stores" }),
          store.dispatch("getData", { resource: "categories" })
        ]);
        return { tempSEO: results[0].data.meta_data[0] };
      } catch (e) {
        console.log(e.message);
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.filteredStores = this.allStores;
        if (this.tempSEO) {
          this.currentSEO = this.tempSEO;
        }
      });
      next();
    },
    created() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
      this.filteredStores = this.allStores;
    },
    watch: {
      filteredStores: function() {
        if (this.filteredStores == null) {
          this.filteredStores = this.allStores;
        }
      }
    },
    computed: {
      ...mapGetters([
        "property",
        "processedStores",
        "processedCategories",
        "storesByCategoryName",
        "findCategoryById",
        "findCategoryByName",
      ]),
      allStores() {
        var all_stores = this.processedStores;
        var store_list = [];
        var vm = this;
        _.forEach(all_stores, function(value, key) {
          if (_.includes(value.store_front_url_abs, "missing")) {
            value.no_store_logo = true;
          } else {
            value.no_store_logo = false;
          }
          store_list.push(value);
        });
        return store_list;
      },
      categorySelect() {
        var vm = this;
        var cats = _.filter(this.processedCategories, function(o) { return o.store_ids !== null; });
        cats = _.map(cats, "name");
        cats.unshift("Categories");
        return cats;
      },
      categorySelectMobile() {
        var vm = this;
        var cats = _.filter(this.processedCategories, function(o) { return o.store_ids !== null; });
        cats = _.map(cats, "name");
        cats.unshift("Alphabetical");
        return cats;
      }
    },
    methods: {
      filterByCategory(value) {
        var category_id = value;
        if (category_id == "Categories" || category_id == "Sort By" || category_id == null || category_id == undefined) {
          category_id = "All";
        } else {
          category_id = this.findCategoryByName(category_id).id;
        }

        if (category_id == "All") {
          this.filteredStores = this.allStores;
          this.selectedCategory = "Categories";
        } else {
          var find = this.findCategoryById;
          var filtered = _.filter(this.allStores, function(o) {
            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
          });
          this.filteredStores = filtered;
        }

        var el = document.getElementById("selectByCat");
        if (el) {
          el.classList.remove("open");
        }
      }
    }
  };
</script>
