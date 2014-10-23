'use strict';

//Plans service used for communicating with the plans REST endpoints
angular.module('plans').factory('Plans', ['$resource',
        function ($resource) {
            return $resource('plans/:planId', {
                planId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]).factory('PlansSearch', ['$resource',
        function ($resource) {
            return $resource('plans/search/:search_text', {
                search_text: '@search_text'
            });
        }
    ]).factory('PlansFutureList', ['$resource',
        function ($resource) {
            return $resource('plans/future_list', {

            });
        }
    ]);