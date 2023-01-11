// export const GA_TRACKING_ID = 'UA-7031630-2';
// export const GTM_ID = 'GTM-MQ7LH6';
// // export const GA_TRACKING_ID = 'AW-1052321972';
// // export const FACEBOOK_PIXEL_ID = "";
//
// // https://developers.google.com/analytics/devguides/collection/gtagjs/events
// // export const event = ({ action, category, label, value }) => {
// //     window.gtag('event', action, {
// //         event_category: category,
// //         event_label: label,
// //         value: value,
// //     })
// // }
//
// function getGAProductFromProduct(product) {
//     return {
//         id: product.handle,
//         name: product.title
//     }
// }
// function getGAProductFromVariant(variant, quantity) {
//     return {
//         id: variant.product.handle,
//         name: variant.product.originalTitle,
//         variant: variant.selectedOptions.map(o => [o.name, o.value].join(": ")).join(", "),
//         quantity,
//         price: variant.priceV2.amount,
//     }
// }
//
// const Analytics = {
//
//     pageview: (url) => {
//
//         // FB
//         if (typeof fbq !== 'undefined') {
//             fbq('track', 'PageView');
//         }
//
//         // GA
//         if (window.gtag) {
//             window.gtag('config', GA_TRACKING_ID, {
//                 page_path: url,
//             })
//         }
//
//         // segment
//         // if (typeof analytics !== 'undefined') {
//         //     analytics.page();
//         // }
//     },
//
//     search: (query) => {
//
//         // segment
//         // if (typeof analytics !== 'undefined') {
//         //     analytics.track('Products Searched', {
//         //         query: query
//         //     });
//         // }
//
//         if (typeof fbq !== 'undefined') {
//             fbq('track', 'Search');
//         }
//
//         if (window.gtag) {
//             window.gtag('event', 'search', {
//                 search_term: query
//             })
//         }
//     },
//
//     productDetailsView: (product) => {
//
//         // GA
//         if (window.gtag) {
//             window.gtag('event', 'view_item', {
//                 // event_category: 'engagement',
//                 event_label: `${product.originalTitle}`,
//                 items: [getGAProductFromProduct(product)]
//             })
//         }
//
//
//
//     },
//
//     addToBag: (variants, quantity, list_name) => {
//
//         // GA
//         if (window.gtag) {
//           variants.forEach(variant => {
//             // console.log('GA add to bag', variant);
//             window.gtag('event', 'add_to_cart', {
//               // event_category: 'EnhancedEcommerce',
//               event_label: `${variant.product.originalTitle}`,
//               // event_label: `${variant.product.originalTitle} - ${variant.title}`,
//               currency: variant.priceV2.currencyCode,
//               list_name,
//               items: [getGAProductFromVariant(variant, 1)]
//             })
//           })
//         }
//
//         if (window.ga) {
//
//         }
//
//         if (typeof fbq !== 'undefined') {
//             fbq('track', 'AddToCart');
//         }
//
//
//     },
//
//     removeFromBag: (variants) => {
//
//         // GA
//         // if (window.gtag) {
//         //   variants.forEach(variant => {
//         //     window.gtag('event', 'remove_from_cart', {
//         //       // event_category: 'EnhancedEcommerce',
//         //       event_label: `${variant.product.originalTitle}`,
//         //       // event_label: `${variant.product.originalTitle} - ${variant.title}`,
//         //       currency: variant.priceV2.currencyCode,
//         //       items: [getGAProductFromVariant(variant, 1)]
//         //     })
//         //   })
//         // }
//     },
//
//     waitlistSignup: (email, variant) => {
//       if (window.gtag) {
//         window.gtag('event', 'waitlist_signup', {
//           event_category: 'engagement',
//           // event_label: 'Newsletter signup',
//           value: email,
//           items: [getGAProductFromVariant(variant, 1)]
//         });
//       }
//     },
//
//     newsletterSignup: (email)  => {
//         if (window.gtag) {
//             window.gtag('event', 'newsletter_signup', {
//                 event_category: 'engagement',
//                 // event_label: 'Newsletter signup',
//                 value: email
//                 });
//         }
//     }
//
// };
//
// export default Analytics;
