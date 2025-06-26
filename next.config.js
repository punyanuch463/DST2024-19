module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.cache = false; // ปิดการใช้ Cache
    return config;
  },
  devIndicators: {
    autoPrerender: false,
  },
  onDemandEntries: {
    websocketPort: 0, 
  },
};
