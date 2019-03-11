<template>
	<header id="header" class="sticky-animate" :class="{ sticky: scrolled, 'nav-up': navUp && showModal, home: route.path === '/'}">
    <div class="header">
      <div class="social_header">
        <div class="container">
          <div class="hours_container">
            <today-hours></today-hours>
          </div>
          <div class="social_container">
            <div class="site_search">
              <search-component :list="searchList" placeholder="Search" :suggestion-attribute="suggestionAttribute" :keys="keys" v-model="search_result" @select="onOptionSelect" :autocomplete="false" :tokenize="true" :minMatchCharLength="3" class="">
                <template slot="item" scope="option" class="manual">
                  <article class="media">
                    <p>{{ option.data.name }}</p>
                  </article>
                </template>
              </search-component>
            </div>
            <div class="social_icons">
              <span v-for="(item, index) in social_media" :key="index">
                <a :href="item.url" target="_blank"><i :class="item.iconClass" aria-hidden="true"></i><p class="accessibility">{{ item.name }}</p></a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="nav_header">
        <div class="container">
          <div class="logo_container">
            <a href="/">
              <img class="logo" src="https://www.mallmaverick.com/system/site_images/photos/000/049/774/original/cambridge_centre.png?1552075136" :alt="property.name + ' Logo'"/>
            </a>
          </div>  
          <div id="menu-icon" @click="showMenu = !showMenu" :class="{ open: showMenu }" class="visible_phone hamburger">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div> 
          <nav id="primary_nav" class="hidden_phone">
						<ul>
              <li class="menu_item" v-for="(item, index) in menu_items" :key="index">
                <router-link v-if="item.sub_menu == undefined" :to="item.href">{{ item.name }}</router-link>
                <span v-if="item.sub_menu != undefined">{{ item.name }}</span>
                  <ul v-if="item.sub_menu" class="sub_menu">
                    <li v-for="(sub_menu, index) in item.sub_menu" :key="index" class="dropdown_item">
                      <router-link :to="sub_menu.href">{{ sub_menu.name }}</router-link>
                    </li>
								</ul>
              </li>
						</ul>
					</nav>
				</div>
        <div class="nav_container show_phone">
          <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
            <nav id="mobile_nav" v-show="showMenu" class="">
              <ul>
                <li v-for="(item, index) in menu_items" :key="index" class="menu_item">
                  <router-link :to="item.href" v-if="item.sub_menu == undefined">{{ item.name }}</router-link>
                  <div v-else>
                    <b-card no-body class="mb-1">
                      <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="item.name" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                          {{ item.name }}
                          <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                          <i v-else  class="fa fa-plus"></i>
                        </b-btn>
                      </b-card-header>
                      <b-collapse v-model="item.show_sub_menu" :id="item.name" :visible="item.show_sub_menu" :accordion="item.name" role="tabpanel" class="accordion_body">
                        <b-card-body v-for="(sub_menu, index) in item.sub_menu" :key="index">
                          <p class="card-text" @click="showMenu = !showMenu">
                            <router-link :to="sub_menu.href">{{ sub_menu.name }}</router-link>
                          </p>
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </div>
                </li>
              </ul>
						    <!-- <div class="mobile_nav_content visible_phone">
                                <div class="mobile_address_container center">
                                    <hr>
                                    <a href="https://goo.gl/maps/RJ5dV8dxP1y" target="_blank">
                                        <p class="property_address">{{ property.address1 }},<br>{{ property.city }}, {{ property.province_state }}</p>
                                    </a>
                                    <a :href="'tel:' + property.contact_phone" >
                                        <h5>{{ property.contact_phone }}</h5>
                                    </a>
                                    <hr>
                                </div>
                                <div class="social_icons center">
                                    <span v-for="item in social_media">
                                        <a :href="item.url" target="_blank">
                                            <p class="accessibility">{{ item.name }}</p>
                                            <i :class="item.iconClass" aria-hidden="true"></i>
                                        </a>
                                    </span>
                                </div>  -->
							<!-- </div> -->
						</nav>
          </transition>
        </div>
      </div>
    </div>
	</header>
</template>

<script>
	import { mapGetters } from 'vuex'
	import moment from 'moment'
  import tz from 'moment-timezone'

  export default {
    components: {
      TodayHours: () => import("~/components/TodayHours.vue"),
      SearchComponent: () => import("~/components/SearchComponent.vue")
    },
    props: ["menu_items", "social_media"],
    data: function data() {
      return {
        search_result: null,
        suggestionAttribute: "name",
        keys: ["name", "description", "tags", "store.name"],

				scrolled: false,
				isOpen: false,
				showMenu: false,
				windowWidth: 0,
				isMobile: false,
				mobileScroll: false,
				lastScrollTop: 0,
				navUp: false,
				navDown: true,
        showModal: false,
      }
    },
    // async asyncData({ store, route }) {
    //   try {
    //     let results = await Promise.all([
    //       store.dispatch("getData", { resource: "events" }),
    //       store.dispatch("getData", { resource: "promotions" }),
    //     ]);
    //     return { socialFeed: results[0].data }
    //   } catch (e){
    //     console.log (e.message);
    //   }
    // },
		created() {
			this.$nextTick(function() {
				window.addEventListener('resize', this.getWindowWidth);
				//Init
				this.getWindowWidth();
      });
		},
		watch: {
			$route (to, from) {
				this.navUp = false;
			},
			windowWidth: function() {
				if (this.windowWidth <= 768) {
					this.isMobile = true;
				} else {
					this.isMobile = false;
				}
			},
			showMenu: function () {
				if (this.showMenu == true) {
					document.body.classList.add("no-scroll");
				} else if (this.showMenu == false) {
					document.body.classList.remove("no-scroll");
				}
			}
		},
    computed: {
      ...mapGetters([
				'property',
        'route',
        'processedEvents',
        'processedPromos',
        'processedJobs',
        'processedStores'
			]),
      searchList() {
        var events = this.processedEvents;
        _.forEach(events, function(value, key) {
          if (_.includes(value.eventable_type, "Property")) {
            value.is_store = false;
          } else {
            value.is_store = true;
          }
        });
        var promos = this.processedPromos;
        _.forEach(promos, function(value, key) {
          if (_.includes(value.promotionable_type, "Property")) {
            value.is_store = false;
          } else {
            value.is_store = true;
          }
        });
        var jobs = this.processedJobs;
        _.forEach(jobs, function(value, key) {
          if (_.includes(value.jobable_type, "Property")) {
            value.is_store = false;
          } else {
            value.is_store = true;
          }
        });
        var stores = this.processedStores;
        _.forEach(stores, function(value, key) {
          value.is_store = true;
        });

        var list = _.union(stores, events, promos, jobs);
        return list;
      }
		},
		methods: {
			getWindowWidth(event) {
				this.windowWidth = window.innerWidth;
			},
			handleScroll () {
				this.scrolled = window.pageYOffset > 100;
			},
			mobileDidScrolled () {
				if (this.isMobile) {
					this.mobileScroll = window.pageYOffset > 0;
					var _this = this;
					// setTimeout(function() {
						if (_this.mobileScroll) {
							_this.mobileHasScrolled();
							_this.mobileScroll = false;
						}
					// }, 150);
				}
			},
			mobileHasScrolled () {
				// var lastScrollTop = 0;
				var delta = 5;
				var navbarHeight = document.getElementById("header").offsetHeight;
				var st = $(window).scrollTop();

				// If they scrolled down and are past the navbar, add class .nav-up.
				// This is necessary so you never see what is "behind" the navbar.
				if (st > this.lastScrollTop && st > navbarHeight){
					// Scroll Down
					this.navUp = true;
				} else {
					// Scroll Up
					if(st + $(window).height() < $(document).height()) {
						this.navUp = false;
					}
				}
				
				this.lastScrollTop = st;
      },
      onOptionSelect(option) {
        var search_results = option;
        // Change VUEX search result to latest result
        Promise.all([
          this.$store.dispatch("INITIALIZE_SEARCH_RESULT", search_results)
        ]);
        this.$router.push({ name: "search-results", query: { searchQuery: this.search_result }});

        this.$nextTick(function() {
          this.search_result = "";
        });
      }
		},
		beforeMount () {
			window.addEventListener('resize', this.getWindowWidth);
			window.addEventListener('scroll', this.handleScroll);
			window.addEventListener('scroll', this.mobileDidScrolled);
		},
		beforeDestroy () {
			window.addEventListener('resize', this.getWindowWidth);
			window.removeEventListener('scroll', this.handleScroll);
			window.removeEventListener('scroll', this.mobileDidScrolled);
		}
  }
</script>
