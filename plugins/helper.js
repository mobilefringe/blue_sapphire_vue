import Vue from 'vue'
import moment from 'moment';
import tz from 'moment-timezone';

Vue.mixin({
  methods: {
    isMultiDay(value, timezone) {
      console.log("value", value)
      var item = value;
      var start_date = moment(item.start_date).tz(timezone).format('MM-DD-YYYY');
      var end_date = moment(item.end_date).tz(timezone).format('MM-DD-YYYY');
      if (start_date === end_date) {
        return false
      } else {
        return true
      }
    },
    isEndingToday(value, timezone) {
      var end_date = moment(item.end_date).tz(timezone).format("MM-DD-YYYY");
      var today = moment().tz(timezone).format("MM-DD-YYYY");
      if (today === end_date) {
        return true;
      } else {
        return false;
      }
    },
    truncate(val_body, length) {
      var truncate = _.truncate(val_body, { length: length, separator: " " });
      return truncate;
    }
  }
})
