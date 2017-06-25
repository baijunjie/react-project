import $ from 'jquery';
import 'jquery.animate';
export { $ };

import * as utils from './utils.js';
export { utils };

import api from './api.js';
export { api };

import popup from '@/assets/plugins/popup/popup.js';
export { popup };

export const storage = {};

export function logout() {
    localStorage.clear();
    for (let key in storage) {
        delete storage[key];
    }
    location.href = '/';
}
