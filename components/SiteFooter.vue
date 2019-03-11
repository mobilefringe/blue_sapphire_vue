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
              <div class="animated_btn">View All Hours</div>
            </a>
            <hr class="footer_divider">
          </div>
          <div class="col-md-6 col-lg-4 order-lg-last">
            <h3 class="footer_title caps">Menu</h3>
            <ul class="footer_menu footer_menu_left">
              <li v-for="(item, index) in menu_items" :key="index">
                <a v-if="item.target" :href="item.href" target="_blank">{{ item.name }}</a>
                <router-link v-else :to="item.href">{{ item.name }}</router-link>
              </li>
            </ul>
            <hr class="footer_divider">
          </div>
          <div class="col-md-12 col-lg-4 footer_center">
            <h3 class="footer_title caps">Follow Us</h3>
            <div id="instafeed">
              <div v-for="(item, index) in instaFeed" :key="index" class="insta_container">
                <a :href="item.link" target="_blank">
                  <img :src="item.insta_img" :alt="truncate(item.insta_caption, 25)"/>
                </a>
              </div>
            </div>
            <hr class="footer_divider">
          </div>
        </div>
        <div class="row footer_logos">
          <div class="col-3">
            <img class="max-width" src="https://www.mallmaverick.com/system/site_images/photos/000/049/774/original/cambridge_centre.png?1552075136" alt="Cambridge Centre Logo" />
          </div>
          <div class="col-3">
            <img class="max-width" src="https://www.mallmaverick.com/system/site_images/photos/000/049/773/original/morguard.png?1552075127" alt="Morguard Logo" />
          </div>
          <div class="col-3">
            <img class="max-width" src="https://www.mallmaverick.com/system/site_images/photos/000/049/772/original/silver_award.png?1552075121" alt="" />
          </div>
          <div class="col-3">
            <img class="max-width" src="https://www.mallmaverick.com/system/site_images/photos/000/049/771/original/ice_centre_logo.png?1552075118" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container">
        <div class="row">
          <div class="col">
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
      this.$store.dispatch("LOAD_PAGE_DATA", { url: "https://cambridgecentre.mallmaverick.com/api/v4/cambridgecentre/social.json" }).then(response => {
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
              value.insta_caption = value.caption.text;
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
  