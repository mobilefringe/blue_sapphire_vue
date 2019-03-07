<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container margin_30">
      <iframe class="margin_30" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.32425251166!2d-80.32201808451613!3d43.39115167913113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b883315d65e15%3A0xdd9962d43d55419b!2sCambridge+Centre!5e0!3m2!1sen!2sca!4v1551294536521" width="100%" height="350" frameborder="0" style="border:0" allowfullscreen></iframe>
      <div class="row">
        <div class="col-md-6">
          <div v-if="currentPage" v-html="currentPage.body" class="page_content"></div>
          <hr class="horizontal_div show_phone">
        </div>
        <div class="col-md-6 border-left">
          <h2 class="margin_30">Contact us with your questions, comments, or for more information.</h2>
          <transition name="custom-classes-transition" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
            <div>
              <div id="send_contact_success" class="alert alert-success" role="alert" v-show="formSuccess">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                <span class="sr-only">Success</span>
                Thank you. A member from our team will reply to you shortly.
              </div>
              <div id="send_contact_error" class="alert alert-danger" role="alert" v-show="formError">
                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span class="sr-only">Error:</span>
                An error occurred when submitting your message. Please try again later.
              </div>   
            </div>
          </transition> 
          <form id="contact-us-form" class="form-horizontal" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
            <div class="row">
              <div class="form-input col-sm-6 col-xs-12" :class="{'has-error': errors.has('first_name')}">
                <label class="" for="first_name">First Name *</label>
                <input id="first_name" v-model="form_data.first_name" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="first_name" data-vv-as="First Name"
                  type="text" data-vv-delay="1000" placeholder="" required>
                <span v-show="errors.has('firts_name')" class="form-control-feedback">{{ errors.first('first_name') }}</span>
              </div>
              <div class="form-input col-sm-6 col-xs-12" :class="{'has-error': errors.has('last_name')}">
                <label class="" for="last_name">Last Name *</label>
                <input id="last_name" v-model="form_data.last_name" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="last_name" data-vv-as="Last Name"
                  type="text" data-vv-delay="1000" placeholder="" required>
                <span v-show="errors.has('last_name')" class="form-control-feedback">{{ errors.first('last_name') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="form-input col-sm-12" :class="{'has-error': errors.has('email')}">
                <label class="" for="email">Email Address *</label>
                <input id="email" v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" data-vv-as="Email"
                  type="email" data-vv-delay="1000" placeholder="" required>
                <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="form-input col-sm-12" :class="{'has-error': errors.has('subject')}">
                <label class="" for="subject">Subject *</label>
                <input id="subject" v-model="form_data.subject" v-validate="'required|alpha_spaces'" class="form-control" :class="{'input': true}" name="subject" data-vv-as="Subject"
                  type="text" data-vv-delay="1000" placeholder="" required>
                <span v-show="errors.has('firts_name')" class="form-control-feedback">{{ errors.first('subject') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="form-input col-sm-12" :class="{'has-error': errors.has('message')}">
                <label class="" for="message">Message *</label>
                <textarea id="message" v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" data-vv-as="Message"
                  type="text" data-vv-delay="1000" placeholder=""></textarea>
                <span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12" :class="{'has-error': errors.has('message')}">
                <label class="checkbox">
                  <input name="agree_newsletter" v-validate="'required:true'" :class="{'input': true}" type="checkbox" required> <span>I agree to receive electronic communications from <span class="caps">{{ property.name }}</span>.</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
              </div>
            </div>
          </form> 
        </div>
      </div>
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
        page_name: "Contact Us",
        currentPage: null,
        form_data: {},
        formSuccess: false,
        formError: false
      }
    },
    async asyncData ({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch('LOAD_SEO', { url: route.fullPath }),
          store.dispatch('LOAD_PAGE_DATA', { url: process.env.MM_HOST + "/pages/cambridgecentre-contact-us.json" })
        ]);
        return { tempSEO: results[0].data.meta_data[0], currentPage: results[1].data }
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

      ]),
      
    },
    methods: {
      validateBeforeSubmit() {
        // this.$validator.validateAll().then((result) => {
        //   if (result) {
            let send_data = new FormData();
            // send_data.append("mailto", this.property.contact_email);
            send_data.append("mailto", "caitlin@mobilefringe.com");
            send_data.append("subject", "You've Recieved a Message from " + this.property.name + " Website.");
            send_data.append("custom[First Name]", this.form_data.first_name);
            send_data.append("custom[Last Name]", this.form_data.last_name);
            send_data.append("custom[Email]", this.form_data.email);
            send_data.append("custom[Subject]", this.form_data.subject);
            send_data.append("custom[Message]", this.form_data.message);
            
            let vm = this;
            fetch("//www.mallmaverick.com/custom_email.js", {
              method: "post",
              body: send_data
            })
            .then(result => {
              vm.formSuccess = true;
            })
            .catch(error => {
              vm.formError = true;
            });
        //   }
        // })
      },
      serializeObject(obj) {
        var newObj = [];
        _.forEach(obj, function (value, key) {
          var tempVal = {};
          tempVal.name = key;
          tempVal.value = value;
          newObj.push(tempVal);
        });
        return newObj;
      }  
    }
  }
</script>