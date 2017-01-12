(function () {

    'use strict';

    angular.module('wfmanagerControllers').controller('PendingCtrl', ['$scope', '$mdDialog', 'processService', 'CONFIG', 'auth',
        /**
         * @name PendingCtrl
         * @ngDoc controllers
         * @memberof wfmanagerControllers
         * 
         * @desc Controller used in Pending tasks view
         */
        function ($scope, $mdDialog, processService, config, auth) {

            $scope.imagePath = config.AVATARS_PATH;
            $scope.allTasks = null;
            $scope.tasksMappedByDefinition = null;
            $scope.filteredTasks = null;
            $scope.definitionNames = [];

            $scope.maxDateBefore = new Date();
            $scope.maxDateBefore.setDate($scope.maxDateBefore.getDate() + 1);

            $scope.searchFilter = { dateAfter: null, dateBefore: null, taskName: "", definitionId: null };

            $scope.orderByOption = null;

            $scope.options = [];

            $scope.sortOption = { title: 'startDate', id: 'startDate' };
            $scope.options.push($scope.sortOption);
            $scope.sortOption = { title: 'worker', id: 'supervisor' };
            $scope.options.push($scope.sortOption);
            $scope.sortOption = { title: 'taskName', id: 'title' };
            $scope.options.push($scope.sortOption);


            processService.getActiveProcesses().then(
                // success callback
                function (response) {
                    $scope.definitions = response.data;

                    $scope.selectAllDefinitions = { name: "showAll", processDefinitionId: "all" };
                    $scope.definitions.push($scope.selectAllDefinitions);

                    initializeCriteria();
                    $scope.searchTasks();
                },
                // error callback
                function (response) {
                    exceptionModal(response);
                });

            /**
             * @memberof PendingCtrl
             * @descr Initializes all search criteria
             *
             */
            function initializeCriteria() {
                if (!$location.search().dateAfter || $location.search().dateAfter == 0) {
                    $scope.searchFilter.dateAfter = new Date();
                    $scope.searchFilter.dateAfter.setMonth($scope.searchFilter.dateAfter.getMonth() - 3);
                    $location.search('dateAfter', $scope.searchFilter.dateAfter.getTime());

                } else
                    $scope.searchFilter.dateAfter = new Date(parseFloat($location.search().dateAfter));

                if (!$location.search().dateBefore || $location.search().dateBefore == 0) {
                    $scope.searchFilter.dateBefore = new Date();
                    $scope.searchFilter.dateBefore.setDate($scope.searchFilter.dateBefore.getDate() + 1);
                    $location.search('dateBefore', $scope.searchFilter.dateBefore.getTime());

                } else
                    $scope.searchFilter.dateBefore = new Date(parseFloat($location.search().dateBefore));

                if (!$location.search().taskName)
                    $location.search('taskName', "");
                else
                    $scope.searchFilter.taskName = $location.search().taskName;

                if (!$location.search().definitionId)
                    $location.search('definitionId', "");
                else
                    $scope.searchFilter.definitionId = $location.search().definitionId;
            };

            /**
             * @memberof PendingCtrl
             * @desc Searches for instances based on given criteria
             *
             */
            $scope.searchTasks = function () {
                var dateAfterTime;
                var dateBeforeTime;

                if ($scope.searchFilter.dateAfter)
                    dateAfterTime = $scope.searchFilter.dateAfter.getTime();
                else
                    dateAfterTime = 0;

                if ($scope.searchFilter.dateBefore)
                    dateBeforeTime = $scope.searchFilter.dateBefore.getTime();
                else
                    dateBeforeTime = 0;

                if (!$scope.searchFilter.definitionId)
                    $scope.searchFilter.definitionId = "all";

                if (!$scope.searchFilter.taskName)
                    $scope.searchFilter.taskName = "";

                processService.getActiveTasks().then(
                    // success callback
                    function (response) {
                        // set default icon
                        $scope.allTasks = response.data;

                        $scope.tasksMappedById = ArrayUtil.mapByProperty2Property($scope.allTasks, "definitionName", "tasks");
                        $scope.taskIds = Object.keys($scope.tasksMappedById);
                        $scope.filteredTasks = response.data;
                        $scope.definitionNames = null;

                        var pairs = {};
                        $scope.taskIds.forEach(function (item) {
                            var task = $scope.tasksMappedById[item]["tasks"][0];
                            pairs[task.definitionName] = item;
                            names.push(task.definitionName);
                        });

                        //make unique list from definition names
                        var u = {};
                        var names = [];
                        for (var i = 0, l = names.length; i < l; ++i) {
                            if (!u.hasOwnProperty(names[i])) {
                                $scope.definitionNames.push(names[i]);
                                u[names[i]] = 1;
                            }
                        }
                    }
                );

                processService.getEndedInstances($scope.searchFilter.definitionId,$scope.searchFilter.taskName, dateAfterTime, dateBeforeTime, true).then(
                    // success callback
                    function (response) {
                        $location.search('definitionId', $scope.searchFilter.definitionId);
                        $location.search('taskName', $scope.searchFilter.taskName);
                        $location.search('dateAfter', dateAfterTime);
                        $location.search('dateBefore', dateBeforeTime);

                        var tasks = response.data;
                        var tasksMapped = ArrayUtil.mapByProperty2innerProperty(tasks, "processInstance", "id", "tasks");
                        var instanceIds = Object.keys(tasksMapped);

                        $scope.endedInstances = [];

                        instanceIds.forEach(function (item) {
                            var task = tasksMapped[item]["tasks"][0];
                            $scope.endedInstances.push(task.processInstance);
                        });
                    },
                    // error callback
                    function (response) {
                        exceptionModal(response);
                    }
                );
            };

            /**
             * @memberof PendingCtrl
             * @desc Returns the difference between due date and current date
             * 
             * @param {Task} task
             * @returns {Number} - The difference between dates
             */
            $scope.taskDelay = function (task) {
                var diff;

                if (task.dueDate === null)
                    return Infinity;

                if (task.endDate) {
                    diff = task.dueDate - task.endDate;

                } else {
                    var currentDate = new Date();
                    diff = task.dueDate - currentDate.getTime();
                }

                var diffInDays = diff / (1000 * 3600 * 24);
                return diffInDays;
            };

            /**
             * Get all process definitions
             */
            processService.getActiveTasks().then(
                // success callback
                function (response) {
                    // set default icon
                    $scope.allTasks = response.data;

                    $scope.tasksMappedById = ArrayUtil.mapByProperty2Property($scope.allTasks, "definitionName", "tasks");
                    $scope.taskIds = Object.keys($scope.tasksMappedById);
                    $scope.filteredTasks = response.data;
                    $scope.definitionNames = null;

                    var pairs = {};
                    $scope.taskIds.forEach(function (item) {
                        var task = $scope.tasksMappedById[item]["tasks"][0];
                        pairs[task.definitionName] = item;
                        names.push(task.definitionName);
                    });

                    //make unique list from definition names
                    var u = {};
                    var names = [];
                    for (var i = 0, l = names.length; i < l; ++i) {
                        if (!u.hasOwnProperty(names[i])) {
                            $scope.definitionNames.push(names[i]);
                            u[names[i]] = 1;
                        }
                    }
                }
            );

            /**
             * @memberof PendingCtrl
             * @desc Selects all available workflow definitions from the checkbox
             */
            $scope.selectAll = function () {
                $scope.filteredTasks = $scope.allTasks;
            };

            /**
             * @memberof PendingCtrl
             * @desc Filters the tasks by the given workflow definition name
             * 
             * @param {String} name
             */
            $scope.selectionChanged = function (name) {
                $scope.filteredTasks = null;
                $scope.filteredTasks = $scope.tasksMappedById[name]["tasks"];
            };

            /**
             * @memberof PendingCtrl
             * @desc Sorting tasks by given option
             *
             * @param {String} optionId
             */
            $scope.sortBy = function (optionId) {
                $scope.orderByOption = optionId;
            };

            /**
             * @memberof PendingCtrl
             * @desc Clears the date picker for the after date
             *
             */
            $scope.clearDateAfter = function () {
                $scope.searchFilter.dateAfter = 0;
                $scope.searchTasks();
            };

            /**
             * @memberof PendingCtrl
             * @desc Clears the date picker for the before date
             *
             */
            $scope.clearDateBefore = function () {
                $scope.searchFilter.dateBefore = 0;
                $scope.searchTasks();
            };

            /**
             * @memberof PendingCtrl
             * @desc Clears the task name filter
             *
             */
            $scope.clearTaskName = function () {
                $scope.searchFilter.taskName = "";
                $scope.searchTasks();
            };

            /**
             * @memberof PendingCtrl
             * @desc Clears any filter
             *
             */
            $scope.clearAllFilters = function () {
                $scope.searchFilter.dateAfter = 0;
                $scope.searchFilter.dateBefore = 0;
                $scope.searchFilter.taskName = "";
                $scope.searchFilter.definitionId = "all";

                $scope.searchTasks();
            };

            /**
             * @memberof PendingCtrl
             * @des Displays a modal panel, showing the exception message
             *
             * @param {any} response
             * @param {event} $event
             */
            function exceptionModal(response, event) {
                $mdDialog.show({
                    controller: function ($scope, $mdDialog) {
                        $scope.error = response.data;

                        $scope.cancel = function () {
                            $mdDialog.hide();
                        };
                    },
                    templateUrl: 'templates/exception.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: false
                });
            };

        }]);
})(angular);
