routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/search-organization/',
    url: './pages/search-organization.html',
  },
  {
    path: '/about/:id',
    url: './pages/about.html',
  },
  {
    path: '/queue/',
    url: './pages/queue.html',
  },
  {
    path: '/queue/:orgId',
    url: './pages/queue.html',
  },
  {
    path: '/line/:id',
    url: './pages/line.html',
  },
  {
    path: '/schedule/:id',
    url: './pages/schedule.html',
  },
  {
    path: '/counter/',
    url: './pages/counter.html',
  },
  {
    path: '/counter/:orgId',
    url: './pages/counter.html',
  },
  {
    path: '/organization/:id',
    url: './pages/organization.html',
  },
  {
    path: '/privacy-policy/',
    url: './pages/privacy-policy.html',
  },
  {
    path: '/terms-and-condition/',
    url: './pages/terms-and-condition.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/booking/',
    url: './pages/booking.html',
  },
  {
    path: '/booking/:id',
    url: './pages/booking.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
