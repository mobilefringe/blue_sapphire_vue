<template>
  <div class="inside_page_banner" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
    <div class="container">
      <h1 v-if="page_name" class="inside_page_title">{{ page_name }}</h1>
    </div>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	
  export default {
    props: ["page_name"],
		beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.pageBanner;
      });
      next();
    },
		mounted() {
      this.pageBanner;
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
          var inside_page_banner = banner[0];
          return inside_page_banner
        }
      },
    }
  }
</script>