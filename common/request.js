import queryString from "query-string";
import _ from "lodash";
import config from "./config";
import Mock from "mockjs";
let request = {};
request.get = function(url, params) {
  if (params) {
    url += "?" + queryString.stringify(params);
  }
  return fetch(url).then(response => response.json());
};
request.post = function(url, body) {
  var options = _.extend(config.header, {
    body: JSON.stringify(body)
  });
  return fetch(url, options).then(response => {
    console.log(response);
    return response.json();
  });
};
export default request;
