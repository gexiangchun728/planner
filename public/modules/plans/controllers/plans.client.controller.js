'use strict';

angular.module('plans').controller('PlansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plans', 'PlansFutureList',
    function ($scope, $stateParams, $location, Authentication, Plans, PlansFutureList) {
        $scope.authentication = Authentication;

        $scope.create = function () {
            var plan = new Plans({
                destination: this.destination,
                comment: this.comment,
                start_date: this.start_date,
                end_date: this.end_date
            });
            plan.$save(function (response) {
                $location.path('plans/' + response._id);

                $scope.destination = '';
                $scope.comment = '';
                $scope.start_date = '';
                $scope.end_date = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (plan) {
            if (plan) {
                plan.$remove();

                for (var i in $scope.plans) {
                    if ($scope.plans[i] === plan) {
                        $scope.plans.splice(i, 1);
                    }
                }
            } else {
                $scope.plan.$remove(function () {
                    $location.path('plans');
                });
            }
        };

        $scope.update = function () {
            var plan = $scope.plan;

            plan.$update(function () {
                $location.path('plans/' + plan._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.plans = Plans.query();
            $scope.print_plans = PlansFutureList.query();
        };

        $scope.findOne = function () {
            Plans.get({
                planId: $stateParams.planId
            }, function (plan) {
                $scope.plan = plan;
                $scope.dayCount = $scope.calcDaysCount($scope.plan.start_date);
            });
        };

        $scope.calcDaysCount = function days_between(date) {

            // The number of milliseconds in one day
            var ONE_DAY = 1000 * 60 * 60 * 24;
            // Convert both dates to milliseconds
            var date1_ms = new Date(date).getTime();
            var date2_ms = new Date().getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date1_ms - date2_ms;
            // Convert back to days and return
            return Math.round(difference_ms / ONE_DAY);
        };

        $scope.open = function (type, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            if (type === 'start') {
                $scope.opened_start = true;
            } else {
                $scope.opened_end = true;
            }

        };
    }
]);