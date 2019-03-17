<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row">
        <div class="col">
          <div class="row">
            <div v-for="(item, index) in awards" :key="index" class="col-md-6">
              <div class="row award_row">
                <div class="col-md-3 text-center">
                  <img class="max-width" :src="item.image_url" :alt="item.name" />
                </div>
                <div class="col-md-9">
                  <h3>{{ item.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import tz from 'moment-timezone'
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
      }
    },
    transition: "page",
    components: {
      insidePageBanner: () => import("~/components/insidePageBanner.vue"),
    },
    data: function data() {
      return {
        tempSEO: {},
        currentSEO: {},
        page_name: "Awards",
      }
    },
    async asyncData ({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath })
        ]);
        return { tempSEO: results[0].data.meta_data[0] }
      } catch (e){
        console.log (e.message);
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
        'repos',
				'findRepoByName'
			]),
			awards() {
        var images = this.findRepoByName("Awards").images;
        console.log("images", images)
        if (images) {
          var sorted = _.sortBy(images, [function(o) { return o.id; }]).reverse();
          return sorted
        }
      }
    }
  }
</script>
