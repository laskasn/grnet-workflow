define(['angular', 'services/authprovider'],

	function (angular) {

		'use strict';

		function navBarCtrl($scope, $mdSidenav, $location, $window, authProvider) {

			$scope.isPrint = window.location.href.indexOf('/print/') >= 0;
			$scope.pages = [];
			$scope.page = { title: null, path: null, icon: null, color: null, disabled: null };

			$scope.inputFile = null;

			$scope.toggle = function () {
				$mdSidenav('navbar').toggle();
			};

			$scope.onSwipeRight = function () {
				$mdSidenav('navbar').open();
			};

			$scope.onSwipeLeft = function () {
				$mdSidenav('navbar').close();
			};

			$scope.goTo = function (path) {
				$mdSidenav('navbar').close().then(function () {

					if (path.indexOf('print') >= 0) {
						$window.open("#" + path, "_blank");
						return;
					}

					$location.path(path);
				});
			};

			$scope.isSelected = function (path) {
				return path === $location.path();
			};

			$scope.logout = function () {
				authProvider.logout();
			};

			$scope.initializePages = function () {

				var isSupervisor = authProvider.getRoles().indexOf("ROLE_Supervisor") >= 0 ? true : false;
				var isProcessAdmin = authProvider.getRoles().indexOf("ROLE_ProcessAdmin") >= 0 ? true : false;
				var isAdmin = authProvider.getRoles().indexOf("ROLE_Admin") >= 0 ? true : false;
				var isUser = authProvider.getRoles().indexOf("ROLE_User") >= 0 ? true : false;

				//always shown. no need to check
				$scope.page = { title: 'myTasks', path: '/task', icon: 'myTasks.svg', color: 'red', disabled: false };
				$scope.pages.push($scope.page);

				//handle admin
				if (isAdmin) {

					$scope.page = { title: 'assignTasks', path: '/assign', icon: 'assignTasks.svg', color: 'red', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'completedTasks', path: '/completed', icon: 'completedTasks.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'startNewProcess', path: '/process', icon: 'startProccess.svg', color: 'blue', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'executionsInProgress', path: '/inprogress', icon: 'history.svg', color: 'purple', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'myActivity', path: '/activity', icon: 'myActivity.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					//handle process admin
				} else if (isProcessAdmin) {

					if(isSupervisor) {
						$scope.page = { title: 'assignTasks', path: '/assign', icon: 'assignTasks.svg', color: 'red', disabled: false };
						$scope.pages.push($scope.page);
					} else {
						$scope.page = { title: 'assignTasks', path: '/assign', icon: 'assignTasks.svg', color: 'red', disabled: true };
						$scope.pages.push($scope.page);
					}

					$scope.page = { title: 'completedTasks', path: '/completed', icon: 'completedTasks.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'startNewProcess', path: '/process', icon: 'startProccess.svg', color: 'blue', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'executionsInProgress', path: '/inprogress', icon: 'history.svg', color: 'purple', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'myActivity', path: '/activity', icon: 'myActivity.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					//handle supervisor
				} else if (isSupervisor) {
					$scope.page = { title: 'assignTasks', path: '/assign', icon: 'assignTasks.svg', color: 'red', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'completedTasks', path: '/completed', icon: 'completedTasks.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'startNewProcess', path: '/process', icon: 'startProccess.svg', color: 'blue', disabled: true };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'executionsInProgress', path: '/inprogress', icon: 'history.svg', color: 'purple', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'myActivity', path: '/activity', icon: 'myActivity.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					//handle user
				} else if (isUser) {
					$scope.page = { title: 'assignTasks', path: '/assign', icon: 'assignTasks.svg', color: 'red', disabled: true };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'completedTasks', path: '/completed', icon: 'completedTasks.svg', color: 'green', disabled: true };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'myActivity', path: '/activity', icon: 'myActivity.svg', color: 'green', disabled: false };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'startNewProcess', path: '/process', icon: 'startProccess.svg', color: 'blue', disabled: true };
					$scope.pages.push($scope.page);

					$scope.page = { title: 'executionsInProgress', path: '/inprogress', icon: 'history.svg', color: 'purple', disabled: false };
					$scope.pages.push($scope.page);

				}
			};

		}

		angular.module('wfWorkspaceControllers').controller('NavBarCtrl', ['$scope', '$mdSidenav', '$location', '$window', 'auth', navBarCtrl]);
	}
);
