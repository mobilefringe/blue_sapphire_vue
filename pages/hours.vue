<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <div class="row">
        <div class="col-md-6">
          <h2>Regular Hours</h2>
          <div v-for="(item, index) in regularHours" :key="index" class="hours_div">
            <div class="day">{{ item.day_of_week | moment("dddd", timezone) }}:</div>
            <div class="time">
              <span v-if="item.is_closed">Closed</span>
              <span v-else>{{ item.open_time | moment("h:mm A", timezone)}} - {{ item.close_time | moment("h:mm A", timezone) }}</span>
            </div>
          </div>
          <div class="margin_30"></div>
          <hr class="horizontal_div regular_hours">
        </div>
        <div class="col-md-6 border_left">
          <h2>Holiday Hours</h2>
          <div v-for="(item, index) in holidayHours" :key="index" class="hours_div holiday">
            <div class="day">{{ item.holiday_name }} ({{ item.holiday_date | moment("MMM DD, YYYY", timezone) }})</div>
            <div class="time">{{ item.open_time | moment("h:mm A", timezone)}} - {{ item.close_time | moment("h:mm A", timezone) }}</div>
          </div>
          <div class="margin_30"></div>
          <hr class="horizontal_div show_phone">
          <h2>Holiday Closure</h2>
          <div v-for="(item, index) in holidayClosures" :key="index" class="hours_div holiday">
            <div class="day">{{ item.holiday_name }} ({{ item.holiday_date | moment("MMM DD, YYYY", timezone) }})</div>
            <div class="time">Closed</div>
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
        page_name: "Centre Hours",
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
        'timezone',
        'getPropertyHours',
        'getPropertyHolidayHours'
      ]),
      regularHours(){
        return _.sortBy(this.getPropertyHours, [function(o) { return o.day_of_week; }]);
      },
      holidayHours(){
        var all_holidays = this.getPropertyHolidayHours;
        var holiday_hours = _.filter(all_holidays, function(o) { return !o.is_closed })
        return holiday_hours;
      },
      holidayClosures(){
        var all_holidays = this.getPropertyHolidayHours;
        var holiday_hours = _.filter(all_holidays, function(o) { return o.is_closed })
        return holiday_hours;
      }
    }
  }
</script>
