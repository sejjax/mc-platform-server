module.exports = {
  apps: [
    {
      name: 'mcapital-server',
      script: '/app/dist/src/main.js',
      watch: false,
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '1G',
      args: '',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
