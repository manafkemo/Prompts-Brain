/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://zanzora.com',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/prompt/*',
    '/admin',
    '/admin/*',
    '/auth/*',
    '/login',
    '/signup',
    '/profile',
    '/icon.svg',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard', 
          '/prompt', 
          '/admin', 
          '/api'
        ],
      },
    ],
  },
}
