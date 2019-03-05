<template>
  <div>
    <inside-page-banner :page_name="page_name" />
    <div class="container" v-if="currentContest">
      <div class="row">
        <div class="col">
          <div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            <span class="sr-only">Success</span>
            Thank you! Your entry has been recorded.
          </div>
          <div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>
            There was an error when trying to submit your entry. Please try again later.
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-center">
          <img class="max-width" :src='currentContest.image_url' :alt="currentContest.name">
        </div>
        <div class="col-sm-12">
          <div class="description_text" v-html="currentContest.rich_description"></div>
        </div>
      </div>
      <form class="form-horizontal" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
        <div class="form-group row">
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('first_name')}">
            <label class="" for="first_name">First Name *</label>
            <input v-model="form_data.first_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="first_name" type="text" placeholder="" data-vv-delay="500" data-vv-as="first name" required>
            <span v-show="errors.has('first_name')" class="form-control-feedback">{{ errors.first('first_name') }}</span>
          </div>
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('last_name')}">
            <label class="" for="last_name">Last Name *</label>
            <input v-model="form_data.last_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="last_name" type="text" placeholder="" data-vv-delay="500" data-vv-as="last name" required>
            <span v-show="errors.has('last_name')" class="form-control-feedback">{{ errors.first('last_name') }}</span>
          </div>
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('email')}">
            <label class="" for="email">Email Address *</label>
            <input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="" data-vv-delay="500" data-vv-as="email" required>
            <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
          </div>
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('phone')}" >
            <label class="" for="phone">Phone Number</label>
            <input v-model="form_data.phone" class="form-control" :class="{'input': true}" name="phone" type="text" placeholder="" data-vv-delay="500" data-vv-as="phone"> <!-- v-validate="'required:true'" -->
            <span v-show="errors.has('phone')" class="form-control-feedback">{{ errors.first('phone') }}</span>
          </div>
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('street')}">
            <label class="" for="street">Address</label>
            <input v-model="form_data.mailing_address" class="form-control" :class="{'input': true}" name="street" type="text" placeholder="" data-vv-delay="500" data-vv-as="street address"> <!-- v-validate="'required:true'" -->
            <span v-show="errors.has('street')" class="form-control-feedback">{{ errors.first('street') }}</span>
          </div>
          <div class="form-input col-sm-6"  :class="{'has-error': errors.has('city')}">
            <label class="" for="city">City</label>
            <input v-model="form_data.city" class="form-control" :class="{'input': true}" name="city" type="text" placeholder="" data-vv-delay="500" data-vv-as="city"> <!-- v-validate="'required:true'" -->
            <span v-show="errors.has('city')" class="form-control-feedback">{{ errors.first('city') }}</span>
          </div>
          <div class="form-input col-sm-6 " :class="{'has-error': errors.has('postal')}">
            <label class="" for="postal">Postal Code</label>
            <input v-model="form_data.postal_code" class="form-control" :class="{'input': true}" name="postal" type="text" placeholder="" data-vv-delay="500" data-vv-as="postal code"> <!-- v-validate="'required:true'" -->
            <span v-show="errors.has('postal')" class="form-control-feedback">{{ errors.first('postal') }}</span>
          </div>
          <div class="form-input col-sm-6" :class="{'has-error': errors.has('birthday')}" >
            <label class="" for="birthday">Birthday *</label>
            <input v-model="form_data.birthday" class="form-control" v-validate="'required|date_format:MM/DD/YYYY'" :class="{'input': true}" name="birthday" type="text" placeholder="MM/DD/YYYY" data-vv-delay="500" data-vv-as="birthday">
            <span v-show="errors.has('birthday')" class="form-control-feedback">{{ errors.first('birthday') }}</span>
          </div>
        </div>
        <div class="form-group row">
          <div class="form-input col-sm-12 col-md-6" :class="{'has-error': errors.has('validate')}">
            <label class="" for="validate">Enter the following number in the field below to validate: {{ correctValNum }}</label> 
            <input v-model="validaNum" v-validate="'required|numeric|min:6|max:6'" class="form-control" :class="{'input': true}" name="validate" type="text" placeholder="" data-vv-delay="500" data-vv-as="validation" required>
            <span v-show="errors.has('validate')" class="form-control-feedback">{{ errors.first('validate') }}</span>
            <span v-if="validaNum.length === 6 && validaNum !== correctValNum && errors.first('validate') == null" class="form-control-feedback" :class="{shake_element : validNumError}">Please enter correct number</span>
          </div>
        </div>
        <div class="form-group row">
          <div class="form-input col-sm-12" :class="{'has-error': errors.has('agree_newsletter')}">
            <label class="checkbox">
              <input name="agree_newsletter" type="checkbox" v-model="form_data.newsletter">
              Yes, I would like to receive ongoing communications related to promotions, events, and special announcements from {{property.name}}.
            </label>
          </div>
          <div class="form-input col-sm-12">
            <label class="checkbox">
              <input name="agree_terms" required type="checkbox" >
                I agree to the <a href = "/pages/eastgate-contest-rules-and-regulations" target="_blank"><u> Contest Rules & Regulations</u></a> and read the <a href="" target="_blank"><u>Privacy Policy</u></a>.
            </label>
          </div>
          <div class="form-input col-sm-12">
            <button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
          </div>
        </div>
      </form> 
    </div>     
  </div>
</template>
<script>
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
    data() {
      return {
        tempSEO: {},
        currentSEO: {},
        page_name: "",
        currentContest: {},
        form_data: {},
        formSuccess: false,
        formError: false,
        validaNum: '',
        correctValNum: null,
        validNumError: false,
      }
    },
    async asyncData({ store, params, route }) {
      try {
        let results = await Promise.all([
          store.dispatch("LOAD_SEO", { url: route.fullPath }),
          store.dispatch("getData", { resource: 'contests' })
        ]);
        return { tempSEO: results[0].data.meta_data[0] };
      } catch (e) {
        console.log(e.message);
      }
    },
    mounted() {
      if (this.tempSEO) {
        this.currentSEO = this.tempSEO;
      }
      this.updateCurrentContest();
      // Create random validation number 
      this.correctValNum = this.randomNumber();
    },
    computed: {
      ...mapGetters([
        'property',
        'timezone',
        'processedContests',
        'findContestBySlug'
      ])
    },
    methods: {
      updateCurrentContest() {
        var contests = this.processedContests;
        var contest_url = "cambridgecentre-cambridge-centre-contest";
        var current_contest = _.filter(contests, function(o) { return o.show_on_slug == contest_url });
        this.currentContest = current_contest[0];
        this.page_name = this.currentContest.name;
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result &&  (this.correctValNum === this.validaNum)) {
            let errors = this.errors;
            this.validNumError = false;
            
          //   // Format contest entry for MM
            var contest_entry = {};
            contest_entry.contest = this.form_data;
            console.log("contest entry", contest_entry.contest)
            var vm = this;
            var host_name = this.property.mm_host.replace("http:", "");
            var url = host_name + "/contests/" + this.currentContest.slug + "/create_js_entry";
            console.log("this.currentContest.slug", this.currentContest.slug)
            $.ajax({
              url: url,
              type: "POST",
              data: contest_entry,
              success: function(data) {
                vm.formSuccess = true;
              },
              error: function(data){
                vm.formError = true;
              }
            });
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        });
      }
    }
  }
</script>