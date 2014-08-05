'use strict';

angular.module('famous-angular-todomvc',
  ['ngAnimate', 'ngCookies',
    'ngTouch', 'ngSanitize',
    'ngResource', 'ui.router',
    'famous.angular' ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/todo.html',
        controller: 'TodoCtrl'
      })
      .state('status', {
        url: '/:status',
        templateUrl: 'partials/todo.html',
        controller: 'TodoCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
;
