module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/logout',
     handler: 'logout.action',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
