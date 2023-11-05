import axios from "axios";

export default axios.create({
  baseURL: "https://pulse-stockprice.s3.us-east-2.amazonaws.com",
  // headers: {'X-Custom-Header': 'xxx'}
});
