export default {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'POST',
        path: '/firebase/login',
        handler: 'firebase-auth.login',
        config: {
          auth: false,
          prefix: '',
          middlewares: ['plugin::users-permissions.rateLimit'],
        },
      },
    ]
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/credentials',
        handler: 'firebase-auth.getCredentials',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/credentials/save',
        handler: 'firebase-auth.save',
        config: {
          policies: [],
        },
      },
    ]
  }
};
