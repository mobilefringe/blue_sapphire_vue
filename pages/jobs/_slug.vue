<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row margin_30">
        <div class="col">
          <h2 class="promo_name">{{ currentJob.name }} <span v-if="currentJob.job_type"> - {{ currentJob.job_type }}</span></h2>
          <h4 class="promo_dates">Deadline: {{ currentJob.end_date | moment("MMM D, YYYY", timezone) }}</h4>
          <hr class="horizontal_div">
          <div v-html="currentJob.rich_description" class="promo_desc"></div>
          <hr v-if="currentJob.contact_name || currentJob.contact_phone || currentJob.contact_email || currentJob.contact_website || currentJob.message" class="horizontal_div">
          <p v-if="currentJob.contact_name" class="no_margin">Contact Name: {{ currentJob.contact_name }}</p>
          <p v-if="currentJob.contact_phone" class="no_margin">Phone Number: {{ currentJob.contact_phone }}</p>
          <p v-if="currentJob.contact_email" class="no_margin">Email Address: {{ currentJob.contact_email }}</p>
          <p v-if="currentJob.contact_website" class="no_margin">Website: {{ currentJob.contact_website }}</p>
          <p v-if="currentJob.message" class="no_margin">Message: {{ currentJob.message }}</p>
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
        page_name: "",
        currentJob: {}
      }
    },
    async asyncData ({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath }),
        ]);
        return { tempSEO: results[0].data.meta_data[0] }
      } catch (e){
        console.log (e.message);
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(function() {
        this.updateCurrentJob(this.$route.params.slug);
      });
      next();
    },
    mounted() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
      this.updateCurrentJob(this.$route.params.slug);
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'findJobBySlug'
      ])
    },
    methods: {
      updateCurrentJob(slug) {
        this.$nextTick(function() {
          this.currentJob = this.findJobBySlug(slug);
          if (this.currentJob === null || this.currentJob === undefined){
            this.$router.replace({ name: 'jobs'});
          } else {
            var property_name = this.property.name
            if (this.currentJob.store == null || this.currentJob.store == undefined) {
              this.page_name = property_name;
            } else {
              this.currentJob.store_name = this.currentJob.store.name;
              this.page_name = this.currentJob.store_name;
            }
          }
        });
      }
    }
  }
</script>