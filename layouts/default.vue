<template>
  <div>
    <site-header :menu_items="menu_items" :social_media="social_media"/>
    <nuxt class="content"/>
    <site-footer :menu_items="footer_menu" :social_media="social_media"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  
  export default {
    transition: 'page',
    data(){
      return{
        socialFeed: {},
        menu_items: [
          {
            name: "Stores",
            id: "menu-1",
            sub_menu: [
              {
                name: "Store Directory",
                href: "/stores"
              },
              {
                name: "New Stores",
                href: "/pages/cambridgecentre-new-stores"
              },
              {
                name: "Centre Map",
                href: "/map"
              }
            ]
          },
          {
            name: "Promotions",
            href: "/promotions"
          },
          {
            name: "Events",
            href: "/events"
          },
          {
            name: "Mall Info",
            href: "#",
            sub_menu: [
              {
                name: "Mall Hours",
                href: "/hours"
              },
              {
                name: "Community Kiosk",
                href: "/pages/cambridgecentre-community-kiosk"
              },
              {
                name: "Awards",
                href: "/pages/cambridgecentre-awards"
              },
              {
                name: "History",
                href: "/pages/cambridgecentre-history"
              }
            ]
          },
          {
            name: "Guest Services",
            href: "#",
            sub_menu: [
              {
                name: "Gift Cards",
                href: "/pages/cambridgecentre-gift-cards"
              },
              {
                name: "Tourism",
                href: "/pages/cambridgecentre-tourism"
              },
              {
                name: "Accessibility",
                href: "/pages/cambridgecentre-accessibility"
              },
              {
                name: "Sustainability",
                href: "/pages/cambridgecentre-sustainability"
              }
            ]
          },
          {
            name: "Contact Us",
            href: "#",
            sub_menu: [
              {
                name: "Contact",
                href: "/contact-us"
              },
              {
                name: "Employment",
                href: "/jobs"
              },
              {
                name: "Leasing",
                href: "/pages/cambridgecentre-leasing"
              },
              {
                name: "Management",
                href: "/pages/cambridgecentre-management"
              }
            ]
          }
        ],
        footer_menu: [
          {
            name: "Directory",
            href: "/stores",
          },
          {
            name: "Centre Map",
            href: "/map",
          },
          {
            name: "Hours",
            href: "/hours",
          },
          {
            name: "Promotions",
            href: "/promotions",
          },
          {
            name: "Events",
            href: "/events",
          },
          {
            name: "Careers",
            href: "/jobs",
          },
          {
            name: "Press Releases",
            href: "/pages/cambridgecentre-press-releases",
          },
          {
            name: "Privacy Policy",
            target: "blank",
            href: "https://www.morguard.com/privacy",
          },
          {
            name: "Disclaimer",
            href: "/pages/cambridgecentre-disclaimer",
          },
          {
            name: "Code of Conduct",
            href: "/",
          },
        ],
        social_media: [
          {
            name: "Facebook",
            url: "https://www.facebook.com/CambridgeCentre",
            iconClass: "fa fa-facebook"
          },
          {
            name: "Twitter",
            url: "https://twitter.com/CambCentre",
            iconClass: "fa fa-twitter"
          },
          {
            name: "Instagram",
            url: "https://www.instagram.com/cambridgecentre/",
            iconClass: "fa fa-instagram"
          },
          {
            name: "YouTube",
            url: "https://www.youtube.com/user/CambridgeCentreONT",
            iconClass: "fa fa-youtube"
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['property'])
    },
    components: {
      SiteHeader: () => import('~/components/SiteHeader.vue'),
      SiteFooter: () => import('~/components/SiteFooter.vue')
    },
  }
</script>