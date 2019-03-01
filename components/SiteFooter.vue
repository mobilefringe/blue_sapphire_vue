<template>
  <footer>
    <div class="footer_nav">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-4">
            <h3 class="footer_title caps">Mall Hours</h3>
            <div class="footer_hours_container">
              <div class="footer_hours" v-for="(item, index) in regularHours" :key="index">
                <span class="day">{{ item.day_of_week | moment("dddd", timezone) }}:</span>
                <span v-if="item.is_closed" class="time">{{ item.day_of_week | moment("dddd", timezone) }}: CLOSED</span>
                <span v-else class="time">{{ item.open_time | moment("hA", timezone) }} - {{ item.close_time | moment("hA",timezone) }}</span>
              </div>
            </div>
            <div class="margin_20 hidden_phone"></div>
            <a href="/hours">
              <div class="footer_btn">
                <span class="footer_btn_text caps">View All Hours</span>
              </div>
            </a>
            <hr class="footer_divider">
          </div>
          
          
          <div class="col-md-6 col-lg-4 order-lg-last">
            <h3 class="footer_title caps">Menu</h3>
            <ul class="footer_menu footer_menu_left">
              <li v-for="(item, index) in menu_items" :key="index">
                <router-link :to="item.href">{{ item.name }}</router-link>
              </li>
            </ul>
            <hr class="footer_divider">
          </div>
          <div class="col-md-12 col-lg-4 footer_center">
            <h3 class="footer_title caps">Follow Us</h3>
            <div id="instafeed">
              <div v-for="(item, index) in instaFeed" :key="index" class="insta_container">
                <a :href="item.link" target="_blank">
                  <img :src="item.insta_img" alt=""/>
                </a>
              </div>
            </div>
            <hr class="footer_divider">
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container">
        <div class="row">
          <div class="col">
            <router-link to="/">
              <img class="show_phone logo" src="//codecloud.cdn.speedyrails.net/sites/5aa1884a6e6f64062b310000/image/png/1520287579515/logosmall-w.png"/>
            </router-link>
            <p>&copy;{{ copyrightYear }} {{ property.name }}.<br class="hidden_now"> All rights reserved. <a href="/pages/cornwall-privacy-policy">Privacy Policy</a> | <a href="">Terms & Conditions</a>.</p>
          </div>
          <div class="col-sm-3 text-right">
            <p>Powered by <a href="http://www.mallmaverick.com/" target="_blank">Mall Maverick</a></p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
  
<script>
  import { mapGetters } from "vuex";
  import moment from "moment";
  
  export default {
    props: ["menu_items", "social_media"],
    data: function() {
      return {
        socialFeed: {},
        newsletter_email: "",
        
        
      };
    },
    created() {
      this.$store.dispatch("LOAD_PAGE_DATA", { url: "https://cornwall.mallmaverick.com/api/v4/cornwall/social.json" }).then(response => {
        this.socialFeed = response.data.social
      });
    },
    computed: {
      ...mapGetters([
        "property",
        "timezone",
        "getPropertyHours",
      ]),
      regularHours(){
        return _.sortBy(this.getPropertyHours, [function(o) { return o.day_of_week; }]);
      },
      instaFeed() {
        if (this.socialFeed && this.socialFeed.instagram && this.socialFeed.instagram.length > 0) {
          var social_feed = _.slice(this.socialFeed.instagram, 0, 6);
          _.forEach(social_feed, function(value, key) {
            if (value.images.thumbnail) {
              value.insta_img = value.images.thumbnail.url;
            }
          });
          return social_feed
        }
      },
      copyrightYear() {
        return moment().year();
      }
    }
  };
</script>
  