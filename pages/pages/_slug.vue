<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row">
        <div class="col">
          <div v-if="currentPage" v-html="currentPage.body" class="page_content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

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
        tempSEO: {},
        currentSEO: {},
        page_name: "",
        currentPage: {}
      };
    },
    async asyncData({ store, params, error, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath })
        ]);
        return { tempSEO: results[0].data.meta_data[0] }
      } catch (e) {
        console.log(e.message);  
      }
    },
    watch: {
      $route: function() {
        this.updateCurrentPage(this.$route.params.slug);
      }
    },
    created() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }

      this.updateCurrentPage(this.$route.params.slug, this.$route);
    },
    computed: {
      ...mapGetters([
        "property"
      ])
    },
    methods: {
      updateCurrentPage(id, route) {
        var _this = this;
        this.$store.dispatch("LOAD_PAGE_DATA", { url: process.env.MM_HOST + "/pages/" + this.$route.params.slug + ".json" }).then(function(response) {
          _this.currentPage = response.data;
          _this.page_name = response.data.title;
        },
        function(error) {
          console.error("Could not retrieve data from server. Please check internet connection and try again.");
          _this.$router.replace({ path: "/" });
        });
      }
    }
  };
</script>

    