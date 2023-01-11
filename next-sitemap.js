module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.splits59.com',
  generateRobotsTxt: true, // (optional)
  exclude: ['/test', '/products/test-product', '/404', '/500', '/fabrics', '/about', '/press', '/journal'],
  changefreq: 'daily',
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? []
    }
  }
  // sitemapSize: 7000
  // ...other options
}
