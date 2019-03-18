<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row store_dets_dir_btns">
        <div class="col directory_container">
          <router-link to="/stores">
            <div class="directory_btn caps">Stores</div>
          </router-link>
          <div id="hideMapBtn" class="directory_btn caps active">Centre Map</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <mapplic-map ref="svgmap_ref" :height="500" :minimap="false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale="5" :storelist="storeList" :floorlist="floorList" tooltiplabel="View Store Details" @updateMap="updateSVGMap"></mapplic-map>
        </div>
      </div>
      <div class="margin_30"></div>
    </div>
  </div>
</template>

<script>
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
        page_name: "Centre Map",
        windowWidth: 0,
        map: null,
      };
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath })
        ]);
        return { tempSEO: results[0].data.meta_data[0] }
      } catch (e) {
        console.log(e.message);  
      }
    },
    // watch: {
		// 	windowWidth: function() {
		// 		if (this.windowWidth <= 768) {
		// 			this.mobileMap = true;
		// 		} else {
		// 			this.mobileMap = false;
    //     }
    //   }
    // },
    mounted() {
      this.getWindowWidth();
      this.getSVGMap;
    },
    computed: {
      ...mapGetters([
        'property',
        'processedStores'
      ]),
      storeList() {
        var all_stores = this.processedStores;
        _.forEach(all_stores, function(value, key) {
          value.zoom = 2;
          if(value.svgmap_region == null){
            value.svgmap_region = value.id;
          }
        });
        return all_stores;
      },
      getSVGMap(){
        var map_url = "//mallmaverick.com" + this.property.svgmap_url;  
        map_url = _.split(map_url, '?');
        map_url = map_url[0];
        return map_url;
      },
      svgMapRef() {
        var reference = null;
        reference = this.$refs.svgmap_ref;

        return reference;
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
      getWindowWidth(event) {
        this.windowWidth = window.innerWidth;
			},
      dropPin(store) {
        this.svgMapRef.showLocation(store.svgmap_region);
      },
      updateSVGMap(map) {
        this.map = map;
        if (this.windowWidth <= 768) {
          map.moveTo(0.5, 0.5, 0.9);
        } else {
          map.moveTo(0.5, 0.5, 1.3);
        }
      }
    },
    beforeMount () {
			window.addEventListener('resize', this.getWindowWidth);
		},
		beforeDestroy () {
			window.addEventListener('resize', this.getWindowWidth);
		}
  };
</script>





  