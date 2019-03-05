<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="directory_container">
            <div v-for="(item, index) in filterButtons" :key="index" class="directory_btn caps" :class="{ active: item.is_active }" @click="filterJobType(item)">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="margin_30 hidden_phone"></div>
      <div v-if="filteredJobs.length == 0 || filteredJobs == null" class="row">
        <div class="col">
          <p>There are no Jobs posted at this time. Please check back soon.</p>
        </div>
      </div>
      <div v-else v-for="(item, index) in filteredJobs" :key="index">
        <div class="row filter_row">
          <div class="col-md-12 col-lg-4">
            <router-link v-if="!item.is_property" :to="'/stores/' + item.store.slug" class="jobs_store_name">
              <p>{{ item.store_name}}</p>
            </router-link>
            <p v-else class="jobs_store_name">{{ item.store_name}}</p>
          </div>
          <div class="col-md-12 col-lg-5">
            <router-link :to="'/jobs/' + item.slug" class="jobs_name">
              <p><span>{{ item.name }}</span> <i class="fa fa-arrow-right arrow_custom"></i></p>
            </router-link>
          </div>
          <div class="col-md-3 hidden_phone">
            <p class="jobs_publish_date text-left"><i class="fa fa-calendar"></i> &nbsp;Deadline: {{ item.end_date | moment("MMM D, YYYY", timezone) }}</p>
          </div>
        </div>
      </div>
      <div class="margin_30"></div>
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
        page_name: "Careers",
        filteredJobs: null,
        filterButtons: [
          {
            name: "All",
            is_active: true,
          },
          {
            name: "Full Time",
            is_active: false,
          },
          {
            name: "Part Time",
            is_active: false,
          },
          {
            name: "Seasonal",
            is_active: false,
          }
        ]
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
        this.filteredJobs = this.jobList;
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
      this.filteredJobs = this.jobList;
    },
    watch: {
      filteredJobs: function() {
        if (this.filteredJobs == null) {
          this.filteredJobs = this.jobList;
        }
      }
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'processedJobs',
      ]),
      jobList() {
        var jobs = this.processedJobs;
        var vm = this;
        var temp_job = [];
        _.forEach(jobs, function(value, key) {
          if (_.isEmpty(value.store)) {
            value.is_property = true;
            value.store_name = vm.property.name;
          } else {
            value.is_property = false;
            value.store_name = value.store.name;  
          }
          temp_job.push(value);
        });
        _.sortBy(temp_job, function(o) { return o.end_date; });
        return temp_job;
      }
    },
    methods: {
      filterJobType(item) {
        var selected_job_type = _.toString(item.name);
        if (selected_job_type == "All" || selected_job_type == null || selected_job_type == undefined) {
          this.filteredJobs = this.jobList;
        } else {
          var jobs = this.jobList;
          var filtered = _.filter(jobs, function(o) { return o.job_type == selected_job_type; });
          this.filteredJobs = filtered;
        }
        _.map(this.filterButtons, function(o) { return o.is_active = false });
        item.is_active = true;
      }
    }
  }
</script>