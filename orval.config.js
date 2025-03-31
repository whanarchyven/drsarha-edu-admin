// const backendUrl = "http://0.0.0.0:3000"

module.exports = {
    sdk: {
      input: `https://med-analytics-2.dev.reflectai.pro/openapi.json`,
      output: {
        target: "./src/app/api/sdk",
        schemas: "./src/app/api/client/schemas",
        client: "swr",
        baseUrl: "/api",
      },
    },
  };
  