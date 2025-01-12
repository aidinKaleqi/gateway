export const routesConfig = [
  {
    path: '/api/auth',
    target: 'http://127.0.0.1:8000/api/auth',
    guardEnabled: false,
  },
  {
    path: '/api/message',
    target: 'http://127.0.0.1:8001/api/message',
    guardEnabled: true,
  },
];
