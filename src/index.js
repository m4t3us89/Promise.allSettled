const axios = require("axios");

axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    console.log("Success");
    return response;
  },
  (error) => {
    console.log("Error");
    // Do something with response error

    // You can even test for a response code
    // and try a new request before rejecting the promise
    if (error.response.status === 401) {
      const requestConfig = error.config;
      return axios(requestConfig);
    }
    return Promise.reject(error);
  }
);

(async function init() {
  const requests = [
    { url: "https://www.mercadobitcoin.net/api/BTC/ticker/" },
    { url: "https://www.NAO_EXISTE.net" },
    { url: "https://www.mercadobitcoin.net/api/BTC/orderbook/" },
    { url: "https://jsonplaceholder.typicode.com/todos/" },
  ].map(({ url }) => axios.get(url));

  const result = await Promise.allSettled(requests);
  const allSucceded = [];
  const allFailed = [];

  for (const { status, value, reason } of result) {
    if (status === "rejected") {
      allFailed.push(reason);
      continue;
    }

    allSucceded.push(value);
  }

  console.log({
    allFailed,
    allSucceded,
  });

  //allSucceded.forEach((data) => console.log(data));
})();
