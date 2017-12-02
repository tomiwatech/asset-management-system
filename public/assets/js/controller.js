var app = angular.module('Asset', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('login', {
            url: '/login',
            views: {
                layout: {
                    templateUrl: "templates/login.html"
                }
            },
            controller: 'loginController'
        })

        .state('signup', {
            url: '/signup',
            views: {
                layout: {
                    templateUrl: "templates/signup.html"
                }
            },
            controller: 'signupController'
        })

        // .state('login', {
        //     url: '/login',
        //     views: {
        //         layout: {
        //             templateUrl: "/path/to/login.html"
        //         }
        //     },
        //     controller: 'loginController'
        // })

        // .state('signup', {
        //     url: '/signup',
        //     templateUrl: 'templates/signup.html',
        //     controller: 'signupCtrl'
        // })


        .state('contact', {
            url: '/contact',
            templateUrl: 'templates/contact.html',
            controller: 'contactController'
        })

    $urlRouterProvider.otherwise('login');
});

app.controller('signupController', function ($scope) {

    $scope.test = "djdjdjdj";

})

app.controller('homeCtrl', function ($scope) {

    $scope.message = 'Hello';

})

app.controller('loginController', function ($scope, $rootScope) {

    $rootScope.data = {
        "email": "",
        "password": ""
    }

    $scope.login = function () {

        if ($rootScope.data.email == "" || $rootScope.data.password == "") {
            swal('Please fill all fields');
            return;
        }

    }

})

app.controller('chatController', function ($scope) {

    $scope.message = "Welcome"

})


app.controller('taskCtrl', function ($scope, $http) {

    $scope.hello = "angularjs";

    var refresh = function () {

        $http.get('/tasks').then(function (response) {

            console.log(response);

            $scope.tasklist = response.data.tasks;

            $scope.task = {};

        });

    }

    refresh();


    // Add a new contact by posting to the server
    $scope.addTask = function (task) {

        $http.post('/tasks', task).then(function (response) {
            console.log(JSON.stringify(response));
            refresh();
        })
    }

    // Delete a contact from the database
    $scope.deleteTask = function (id) {
        console.log(id);
        $http.delete('/tasks/' + id).then(function (response) {
            console.log(response);
            refresh();
        })
    }

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/tasks/' + id).then(function (response) {
            console.log(response.data);
            $scope.task = response.data.task;
        })
    }

    $scope.updateTask = function (task) {
        console.log(task);
        $http.post('/tasks/update/', task).then(function (response) {
            console.log(response);
            refresh();
        })
    }

    $scope.deselect = function () {
        $scope.task = {};
    }

});