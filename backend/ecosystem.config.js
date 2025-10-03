module.exports = {
  apps: [
    {
      name: "chat-api",
      script: "dist/main.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
