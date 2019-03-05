<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container">
      <div class="row"> 
        <div class="col-lg-6">
          <h2>Keep current.</h2>
          <div class="margin_30 hidden_phone"></div>
        <!-- </div>
      </div>
      <div class="row"> 
        <div class="col-lg-6"> -->
          <p> Sign up for our newsletter and you’ll be the first to know about upcoming events and promotions.</p>
          <hr class="horizontal_div show_phone">
        </div>
        <div class="col-lg-6 border-left">
          <div id="mc_embed_signup">
            <form action="https://cambridge-centre.us1.list-manage.com/subscribe/post?u=b26db4847968e3b7266c1945d&amp;id=6c8b980642" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="form-horizontal validate" target="_blank" novalidate>
              <div id="mc_embed_signup_scroll">
                <div class="form-group row">
                  <div class="col-md-12">
                    <div class="indicates-required">
                      <span class="asterisk">*</span> indicates required
                    </div>
                  </div>
                  <div class="form-input col-md-6">
                    <div class="mc-field-group">
                      <label class="accessibility" for="mce-FNAME">First Name  <span class="asterisk">*</span></label>
                      <input type="text" value="" name="FNAME" class="form-control required" id="mce-FNAME" placeholder="First Name *">
                    </div>
                  </div>
                  <div class="form-input col-md-6">
                    <div class="mc-field-group">
                      <label class="accessibility" for="mce-LNAME">Last Name  <span class="asterisk">*</span></label>
                      <input type="text" value="" name="LNAME" class="form-control required" id="mce-LNAME" placeholder="Last Name *">
                    </div>
                  </div>
                  <div class="form-input col-lg-12">
                    <div class="mc-field-group">
                      <label class="accessibility" for="mce-EMAIL">Email Address  <span class="asterisk">*</span></label>
                      <input type="email" value="" name="EMAIL" class="form-control required email" id="mce-EMAIL" placeholder="Email *">
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-12">
                    <div class="mc-field-group input-group">
                      <!-- <strong>Opt-in  <span class="asterisk">*</span></strong> -->
                      <label class="opt_in" for="mce-OPTIN-0">
                        <input type="radio" value="I agree to receive Commercial Electronic Messages from Morguard, the management company of Cambridge Centre and its affiliates that will include: special retail sales offers, promotions, new retailer announcements, upcoming events, trend and style news and other inside information. You can unsubscribe at any time by emailing info@cambridge-centre.com. Morguard’s contact information is as follows: 55 City Centre Drive, Suite 800, Mississauga, ON, L5B 1M3, Attention: Privacy Officer. Website: morguard.com" name="OPTIN" id="mce-OPTIN-0">
                        I agree to receive Commercial Electronic Messages from Morguard, the management company of Cambridge Centre and its affiliates that will include: special retail sales offers, promotions, new retailer announcements, upcoming events, trend and style news and other inside information. You can unsubscribe at any time by emailing info@cambridge-centre.com. Morguard’s contact information is as follows: 55 City Centre Drive, Suite 800, Mississauga, ON, L5B 1M3, Attention: Privacy Officer. Website: morguard.com
                      </label>
                    </div>
                  </div>
                </div>
                <div id="mce-responses" class="clear">
                  <div class="response" id="mce-error-response" style="display:none"></div>
                  <div class="response" id="mce-success-response" style="display:none"></div>
                </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                <div style="position: absolute; left: -5000px;" aria-hidden="true">
                  <input type="text" name="b_b26db4847968e3b7266c1945d_6c8b980642" tabindex="-1" value="">
                </div>
                <div class="form-group row">
                  <div class="col-lg-12">
                    <!-- Signup location -->
                    <input type="hidden" name="SIGNUP" id="SIGNUP" value="website" />
                    <div class="clear">
                      <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="animated_btn button">
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- <form class="form-horizontal" action="https://mobilefringe.createsend.com/t/d/s/fiilhi/" method="post">
            <div class="form-group row">
              <div class="form-input col-md-6 col-lg-12">
                <label class="accessibility" for="cm-name">Name</label>
                <input v-model="form_data.name" required class="form-control" name="cm-name" type="text" placeholder="Name">
              </div>
              <div class="form-input col-md-6 col-lg-12">
                <label class="accessibility" for="cm-irudui-irudui">Email</label>
                <input v-model="form_data.email" required class="form-control" name="cm-fiilhi-fiilhi" type="email" placeholder="Email" id="newsletter_email">
              </div>
            </div>
            <div class="form-group row">
              <div class="form-input col-sm-12">
                <label class="checkbox">
                  <input name="agree_newsletter" required  type="checkbox">
                  I agree to receive communications from {{ property.name }}. 
                </label>
              </div>
            </div>
            <div class="form-group row">
              <div class="form-input col-sm-12">
                <button class="animated_btn" type="submit" :disabled="formSuccess">Subscribe</button>
              </div>
            </div>
          </form> -->

              
        </div>
      </div>
      <div class="margin_30"></div>    
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from '~/plugins/axios'

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
        page_name: "E-Newsletter",
        form_data : {},
        formSuccess : false,
        formError: false
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
    mounted () {
      this.form_data.email = this.$route.query.email;
      $("#mce-EMAIL").val(this.form_data.email);
      console.log("this.$route.query", this.$route.query);
    },
    watch : {
      $route () {
        this.form_data.email = this.$route.query.email;
        $("#mce-EMAIL").val(this.form_data.email);
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

      ]),
      
    },
    methods: {
      
    }
  }
</script>

