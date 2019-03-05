<template>
  <!-- <div class="inside_page_banner" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }"> -->
  <div class="inside_page_banner" v-bind:style="{ backgroundImage: 'url(https://via.placeholder.com/1920x144)' }">
    <div class="container">
      <h1 v-if="page_name" class="inside_page_title">{{ page_name }}</h1>
    </div>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	
  export default {
    props: ["page_name"],
    data: function data() {
      return {
				// pageBanner: null,	
      }
    },
		beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.pageBanner;
      });
      next();
    },
		mounted() {
			// this.pageBanner;
    },
    computed: {
      ...mapGetters([
				'property',
        'route',
        'repos',
				'findRepoByName'
			]),
			pageBanner() {
        var banner = this.findRepoByName("Inside Page Banner").images;
        if (banner) {
          console.log("banner", banner)
          var inside_page_banner = banner[0];
          return inside_page_banner
        }
      }
		}
  }
</script>