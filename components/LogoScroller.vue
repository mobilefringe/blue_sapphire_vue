<template>
  <div v-if="featuredStores && featuredStores.length > 0" class="feature_logo_container">
    <slick ref="slick" :options="logoOptions">
      <div v-for="(item, index) in featuredStores" :key="index">
        <img class="max-width" :src="item.image_url" :alt="item.name + ' Logo'" />
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
          centerMode: true,
          cssEase: "linear",
          dots: false,
          infinite: true,
          slidesToShow: 9,
          speed: 5000,
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
        // console.log("stores", stores)
        var featured_stores = [];
        _.forEach(stores, function(value, key) {
          // if (store is featured) {
            if (!_.includes(value.store_front_url_abs, "missing")){
              featured_stores.push(value);
            }
          // }
        })
        return featured_stores;
      }
		}
  }
</script>