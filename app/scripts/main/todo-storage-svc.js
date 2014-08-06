/*global angular */

/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('famous-angular-todomvc')
  .factory('todoStorage', function () {
    'use strict';

    var STORAGE_ID = 'todos-famous-angular';

    return {
      get: function () {
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      },

      put: function (todos) {
        localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
      }
    };
  });
