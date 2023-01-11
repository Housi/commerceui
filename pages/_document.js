import Document, { Html, Head, Main, NextScript } from 'next/document'
// import {GA_TRACKING_ID, GTM_ID} from "../helpers/analytics";
import React from 'react'

const IS_STAGING = process.env.IS_STAGING || process.env.IS_STAGING === 'true'

const RESET = `
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
`

const GLOBAL_STYLES = `
${RESET}
html {
  background-color: white;
}
body {
  background-color: white;
  margin: 0;
  padding: 0;
  text-underline-position: under;
  /*text-rendering: geometricPrecision;*/
  -webkit-font-smoothing: antialiased;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  appearance: none;
}

a {
  color: inherit;
  text-decoration: none;
}
a:focus, button:focus, input:focus {
  outline: none;
}
a:focus-visible, button:focus-visible, input:focus-visible + label {
  outline: blue auto 1px;
}

_::-webkit-full-page-media, _:future, :root button:focus, :root a:focus {
  outline: blue auto 1px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
`

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US" dir="ltr">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
          <link rel={'stylesheet'} href={'/fonts/style.css'} />
          <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

          <script
            dangerouslySetInnerHTML={{
              __html: `
          const handleMessage = (event) => {
            if (event.origin !== "https://shop.splits59.com") {
              return;
            }
            if(event.data.customerData) {
              window.customerData = event.data.customerData
            }
          };
          window.addEventListener('message', handleMessage);
        `
            }}
          />

          {/* KLAVIYO PIXEL */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
          setTimeout( () => {

            var _learnq = _learnq || [];

            _learnq.push(['account', 'kE6WEv']);

            (function () {
            var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
            b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/analytics/analytics.js';
              var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
            })();

          } ,5000)
        `
            }}
          />

          {/* Google Tag Manager */}

          {IS_STAGING ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=nNYzbMXcPjRTx-fS9wM9wQ&gtm_preview=env-75&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MQ7LH6');
            `
              }}
            />
          ) : (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MQ7LH6');
            `
              }}
            />
          )}
          {/* End Google Tag Manager */}
        </Head>
        <body>
          {/* Google Tag Manager iframe for Staging */}
          {IS_STAGING ? (
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MQ7LH6&gtm_auth=nNYzbMXcPjRTx-fS9wM9wQ&gtm_preview=env-75&gtm_cookies_win=x"
                height={'0'}
                width={'0'}
                style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
              />
            </noscript>
          ) : (
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MQ7LH6"
                height={'0'}
                width={'0'}
                style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
              />
            </noscript>
          )}

          {/* End of Google Tag Manager iframe */}

          {/* App main content */}

          <Main />
          <NextScript />

          {/* End of App main content */}

          {/* Shopify pixel for user account */}
          <iframe
            src={'https://shop.splits59.com/pages/pixel'}
            height={'0'}
            width={'0'}
            style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
          />

          {/* Hero app */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
          window.HeroWebPluginSettings = { applicationId: "28a604b5-d59b-4278-a255-265b7bc04067" };
        `
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          (function(i,a,m,h,e,r,o){i.HeroObject=e;i[e]=i[e]||function(){(i[e].q=i[e].q||[]).push(arguments)},i[e].l=1*new Date;r=a.createElement(m),o=a.getElementsByTagName(m)[0];r.async=1;r.src=h;o.parentNode.insertBefore(r,o)})(window,document,"script","https://cdn.usehero.com/loader.js","hero");
        `
            }}
          />

          {/* Accessibe */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
          setTimeout( function() {
            (function(){ var s = document.createElement('script'), e = ! document.body ? document.querySelector('head') : document.body; s.src = 'https://acsbapp.com/apps/app/dist/js/app.js'; s.async = true; s.onload = function(){
            acsbJS.init({ 
              statementLink : '', 
              footerHtml : '', 
              hideMobile : true,
              hideTrigger : true,
              language : 'en', 
              position : 'left', 
              leadColor : '#146FF8', 
              triggerColor : '#000000', 
              triggerRadius : '50%', 
              triggerPositionX : 'left', 
              triggerPositionY : 'bottom', 
              triggerIcon : 'people', 
              triggerSize : 'medium', 
              triggerOffsetX : 20, 
              triggerOffsetY : 20, 
              mobile : {
                triggerSize : 'small',
                triggerPositionX : 'left',
                triggerPositionY : 'center',
                triggerOffsetX : 0,
                triggerOffsetY : 0,
                triggerRadius : '0'
              }
            });}; e.appendChild(s);}());
          }, 3000 )
        `
            }}
          />

          {/*<script dangerouslySetInnerHTML={{__html: `*/}
          {/*  window.addEventListener('load', function() {*/}
          {/*  (function(document, tag) {*/}
          {/*    var script = document.createElement(tag);*/}
          {/*    var element = document.getElementsByTagName('body')[0];*/}
          {/*    script.src = 'https://acsbap.com/api/app/assets/js/acsb.js';*/}
          {/*    script.async = true;*/}
          {/*    script.defer = true;*/}
          {/*    (typeof element === 'undefined' ? document.getElementsByTagName('html')[0] : element).appendChild(script);*/}
          {/*    script.onload = function() {*/}
          {/*      acsbJS.init({*/}
          {/*        statementLink : '',*/}
          {/*        feedbackLink : '',*/}
          {/*        footerHtml : '',*/}
          {/*        showAllActions : false,*/}
          {/*        keyNavStrong : false,*/}
          {/*        hideMobile : true,*/}
          {/*        hideTrigger : true,*/}
          {/*        language : 'en',*/}
          {/*        leadColor : '#146ff8',*/}
          {/*        triggerColor : '#146ff8',*/}
          {/*        size : 'big',*/}
          {/*        position : 'left',*/}
          {/*        triggerRadius : '50%',*/}
          {/*        triggerPositionX : 'left',*/}
          {/*        triggerPositionY : 'bottom',*/}
          {/*        triggerIcon : 'default',*/}
          {/*        triggerSize : 'medium',*/}
          {/*        triggerOffsetX : 20,*/}
          {/*        triggerOffsetY : 20,*/}
          {/*        usefulLinks : { },*/}
          {/*        mobile : {*/}
          {/*          triggerSize : 'small',*/}
          {/*          triggerPositionX : 'left',*/}
          {/*          triggerPositionY : 'center',*/}
          {/*          triggerOffsetX : 0,*/}
          {/*          triggerOffsetY : 0,*/}
          {/*          triggerRadius : '0'*/}
          {/*        }*/}
          {/*      });*/}
          {/*    };*/}
          {/*  }(document, 'script'));*/}
          {/*})`}} />*/}

          {/* Klaviyo */}
          <script async type="text/javascript" src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=kE6WEv" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
        window['friendbuy'] = window['friendbuy'] || [];
        window['friendbuy'].push(['widget', "edu-qkb"]);
      `
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
