<template>
  <div v-if="featuredStores && featuredStores.length > 0" class="featured_logo_row">
    <slick ref="slick" :options="logoOptions">
      <div v-for="(item, index) in featuredStores" :key="index">
        <div class="featured_logo_container">
          <img class="max-width" :src="item.image_url" :alt="item.name + ' Logo'" />
        </div>
      </div>
    </slick>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	
  export default {
    components: {
      Slick: () => import("vue-slick")
    },
    data: function data() {
      return {
        logoOptions: {
          arrows: false,
          autoplay: true,
          autoplaySpeed: 0,
          // centerMode: true,
          cssEase: "linear",
          dots: false,
          infinite: true,
          slidesToShow: 9,
          speed: 5000,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 5,
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
              }
            } 
          ]
        },
      }
    },
		beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.pageBanner;
      });
      next();
    },
		mounted() {

    },
    computed: {
      ...mapGetters([
        'processedStores'
      ]),
      featuredStores() {
        var stores = this.processedStores;
        var featured_stores = [];
        _.forEach(stores, function(value, key) {
          if (value.is_featured_store) {
            if (!_.includes(value.store_front_url_abs, "missing")){
              featured_stores.push(value);
            }
          }
        });
        return featured_stores;
      }
		}
  }
</script>