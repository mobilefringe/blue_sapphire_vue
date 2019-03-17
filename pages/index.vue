<template>
  <div>
    <div v-if="homeBanners && homeBanners.length > 0" class="banner_container">
      <div class="prev"></div>
      <slick ref="slick" :options="heroBannerOptions">
        <div v-for="(item, index) in homeBanners" :key="index">
          <div v-if="item.url">
            <a :href="item.url">
              <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + item.image_url + ')' }"></div>
            </a>
          </div>
          <div v-else>
            <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + item.image_url + ')' }"></div>
          </div>
        </div>
      </slick>
      <div class="next"></div>
    </div>
    <!-- FEATURE ITEM ROW -->
    <div class="feature_container">
      <div class="container">
        <div  v-for="(item, index) in featureItemsRow"  :key="index" class="width_30">
          <a :href="item.url">
            <img :src="item.image_url" :alt="item.name"/>
          </a>
        </div>
      </div>
    </div>
    <div id="mobileHome" class="margin_60"></div>
    <div class="container">
      <div class="row">
        <div v-for="(item, index) in featuredImageOne" :key="index" class="col-md-6 no_padding">
          <div v-if="item.url">
            <a :href="item.url" class="">
              <img class="max-width" :src="item.image_url" :alt="item.name">
            </a>
          </div>
          <div v-else >
            <img class="max-width" :src="item.image_url" :alt="item.name">
          </div>
        </div>
        <div class="col-md-6 no_padding">
          <div class="col">
            <div v-if="featureContentOne" v-html="featureContentOne.body" class="home_page_content page_content"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-for="(item, index) in featuredImageTwo" :key="index" class="col-md-6 order-md-2 no_padding">
          <div v-if="item.url">
            <a :href="item.url" class="">
              <img class="max-width" :src="item.image_url" :alt="item.name">
            </a>
          </div>
          <div v-else >
            <img class="max-width" :src="item.image_url" :alt="item.name">
          </div>
        </div>
        <div class="col-md-6 no_padding">
          <div class="col">
            <div v-if="featureContentTwo" v-html="featureContentTwo.body" class="home_page_content page_content"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- LOGO SLIDER -->
    <logo-scroller />
    <!-- NEWSLETTER SIGN-UP -->
    <div class="feature_container">
      <div class="newsletter_container">
        <h1>Sign up for our e-newsletter</h1> 
        <div class="newsletter_form_container">
          <label for="emailAddress" class="accessibility">Enter Email Address</label>
          <input id="emailAddress" v-model="newsletter_email" type="text" placeholder="Email Address" class="newsletter_input" required />
          <button @click="newsletterRoute" class="newsletter_btn animated_btn">Subscribe</button>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import moment from "moment";
  
  export default {
    components: {
      Slick: () => import("vue-slick"),
      LogoScroller: () => import("~/components/LogoScroller.vue")
    },
    transition: "page",
    data: function() {
      return {
        tempSEO: null,
        currentSEO: {},
        heroBannerOptions: {
          arrows: true,
          autoplay: false,
          autoplaySpeed: 5000,
          cssEase: "linear",
          dots: false,
          fade: true,
          infinite: true,
          slidesToShow: 1,
          speed: 1600,
          prevArrow: ".prev",
          nextArrow: ".next"
        },
        featureContentOne: {},
        featureContentTwo: {},
        newsletter_email: ""
      };
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", { url: "/" }),
          store.dispatch("getData", { resource: "banners" }),
          store.dispatch("getData", { resource: "feature_items" }),
          store.dispatch('LOAD_PAGE_DATA', { url: process.env.MM_HOST + "	/pages/cambridgecentre-home-feature-1.json"}),
          store.dispatch('LOAD_PAGE_DATA', { url: process.env.MM_HOST + "	/pages/cambridgecentre-home-feature-2.json"})
          // store.dispatch("getData", { resource: "popups" })
        ]);
        return { tempSEO: results[0].data.meta_data[0], featureContentOne: results[3].data, featureContentTwo: results[4].data };
      } catch (e) {
        console.log(e.message);
      }
    },
    mounted() {
      // Update SEO
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
    },
    watch: {
      show_popup() {
        if (this.show_popup === true) {
          document.body.classList.add("no-scroll");
        } else if (this.show_popup === false) {
          document.body.classList.remove("no-scroll");
        }
      }
    },
    computed: {
      ...mapGetters([
        "property"
      ]),
      // currentPopup() {
      //   var popup = this.$store.state.popups;
      //   return popup;
      // },
      homeBanners() {
        var banners = this.$store.state.banners;
        banners = _.orderBy(banners, ["position"], ["asc"]);
        return banners;
      },
      featureItemsRow() {
        var all_features = this.$store.state.feature_items;
        var features_row = _.slice(all_features, 0, 3);
        return features_row;
      },
      featuredImageOne() {
        var all_features = this.$store.state.feature_items;
        var features_image = _.slice(all_features, 3, 4);
        return features_image;
      },
      featuredImageTwo() {
        var all_features = this.$store.state.feature_items;
        var features_image = _.slice(all_features, 4, 5);
        return features_image;
      }
    },
    methods: {
      closePopup() {
        this.show_popup = false;
        document.getElementById("popup_backdrop").style.display = "none";
      },
      newsletterRoute() {
        this.$router.push("/newsletter?email=" + this.newsletter_email);
        this.newsletter_email = "";
      }
    }
  };
</script>

<style>
  @import "~/node_modules/slick-carousel/slick/slick.css";
</style>