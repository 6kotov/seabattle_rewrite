import Vue from "vue";
import axios from "axios";
import { $$ } from "../components/Common/utils";

const DEV_MODE = process.env.VUE_APP_RUNMODE_ENV === "production";
const backend_host = process.env.VUE_APP_BACKEND_URL;
const backend_port = process.env.VUE_APP_BACKEND_PORT;
const http_schema = "http:";
const port_str = backend_port === 80 ? "" : ":" + backend_port;
const BACKEND_URL = http_schema + "//" + backend_host + port_str;

function default_error_handler(error) {
  Vue.$log.error(error);
}

export function load_catalog_info_mock(performer, action) {
  const LATENCY = 1;
  const start_data = require("./mock-data/start_game_info");
  const run_data = require("./mock-data/run_game_info");
  const stop_data = require("./mock-data/stop_game_info");
  let get_data =
    action === "START" ? start_data : action === "RUN" ? run_data : stop_data;
  Vue.$log.debug("getCatalog. URL: '" + get_data + "'");
  setTimeout(() => {
    performer(get_data);
  }, LATENCY);
}

export function load_catalog_info(performer, action) {
  const whole_url =
    BACKEND_URL + $$.startswith(action, "/") ? action : "/" + action;
  Vue.$log.debug("getCatalog. URL: '" + whole_url + "'");
  return axios({ url: whole_url, method: "GET" })
    .then(response => performer(response.data))
    .catch(default_error_handler);
}

export function request_info(performer, path, obj) {
  const path_x = $$.startswith(path, "/") ? path : "/" + path;
  const whole_url = BACKEND_URL + path_x;
  // const whole_url = backend_host + backend_port + path
  return axios
    .post(whole_url, obj)
    .then(response => performer(response.data))
    .catch(default_error_handler);
}
export default {
  // request_info : DEV_MODE ? load_catalog_info_mock : request_info
  request_info: DEV_MODE ? request_info : load_catalog_info_mock
};
