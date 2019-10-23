import Vue from "vue"
import axios from 'axios'
import {$$} from '../components/Common/utils'


const DEV_MODE = process.env.VUE_APP_RUNMODE_ENV === 'development'

const backend_host = process.env.VUE_APP_BACKEND_URL
const backend_port = process.env.VUE_APP_BACKEND_PORT
const http_schema = 'http:'
const port_str = backend_port === 80 ? "" : ":" + backend_port
const BACKEND_BASE_URL = http_schema + '//' + backend_host + port_str


function default_error_handler(error) {
     Vue.$log.error(error)
}


export function  load_catalog_info_mock(performer, action) {
    const LATENCY = 1
    const start_data  = require('./mock-data/start_game_info')
    const run_data  = require('./mock-data/run_game_info')
    const stop_data  = require('./mock-data/stop_game_info')
    let get_data = action === "START" ? start_data : action === "RUN" ? run_data : stop_data
    Vue.$log.debug("MOCK CATALOG DATA", get_data)
    setTimeout(() => { performer(get_data) }, LATENCY)
}

export function load_catalog_info(performer, action) {
    const whole_url = BACKEND_BASE_URL + $$.startswith(action, "/") ? action : "/" + action
    Vue.$log.debug("getCatalog. URL: '" + whole_url + "'")
    return axios({url: whole_url, method: 'GET'})
        .then((response) => performer(response.data))
        .catch(default_error_handler)
}

export function send_game_info (performer, action) {
    const whole_url = BACKEND_BASE_URL + $$.startswith(action, "/") ? action : "/" + action
    Vue.$log.debug("send_Catalog. URL: '" + whole_url + "'")
    return axios({url: whole_url, method: 'POST'})
}
 export  default {
     load_game_info : DEV_MODE ? load_catalog_info_mock : load_catalog_info,
     send_game_info
 }