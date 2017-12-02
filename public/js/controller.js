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

        .state('home', {
            url: '/home',
            views: {
                layout: {
                    templateUrl: "templates/home.html"
                }
            },
            controller: 'homeController'
        })

        .state('addasset', {
            url: '/addasset',
            views: {
                layout: {
                    templateUrl: "templates/addasset.html"
                }
            },
            controller: 'assetController',
            // onEnter: function () {
            //     location.reload();
            // }
        })

        .state('allassets', {
            url: '/allasset',
            views: {
                layout: {
                    templateUrl: "templates/allassets.html"
                }
            },
            controller: 'assetController',
        })


    $urlRouterProvider.otherwise('login');
});

app.controller('signupController', function ($scope, $rootScope, $http, $state) {

    function emptyFormFields() {
        $rootScope.data.username == "";
        $rootScope.data.password == "";
        $rootScope.data.email == "";
        $rootScope.data.fullname == "";
    }

    $rootScope.data = {
        "username": "",
        "fullname": "",
        "email": "",
        "password": ""
    }

    $scope.signup = function () {

        if ($rootScope.data.email == "" || $rootScope.data.password == "" || $rootScope.data.fullname == "" || $rootScope.data.username == "") {
            swal('Please fill all fields');
            return;
        }

        var data = {
            'username': $rootScope.data.username,
            'fullname': $rootScope.data.fullname,
            'email': $rootScope.data.email,
            'password': $rootScope.data.password
        }

        $http.post('/users', data).then(function (response) {
            if (response.data.responseCode == "00") {
                swal('Thank You for Signing up. You can now login');
                emptyFormFields();
                $state.go('login')
            } else if (response.data.responseCode == "02") {
                swal('User already exists');
                emptyFormFields();
            } else {
                swal('Error adding user');
                emptyFormFields();
            }

            console.log(JSON.stringify(response));
        }, function (err) {
            console.log(JSON.stringify(err));
        })



    }

})

app.controller('loginController', function ($scope, $rootScope, $http, $state) {

    function emptyFormFields() {
        $rootScope.data.username == "";
        $rootScope.data.password == "";
        $rootScope.data.email == "";
        $rootScope.data.fullname == "";
    }

    $rootScope.data = {
        "username": "",
        "password": ""
    }

    $scope.login = function () {

        if ($rootScope.data.username == "" || $rootScope.data.password == "") {
            swal('Please fill all fields');
            return;
        }

        var datum = {
            'username': $rootScope.data.username,
            'password': $rootScope.data.password
        }

        $http.post('/users/authenticate', datum).then(function (response) {
            // alert(JSON.stringify(response));
            if (response.data.responseCode == "00") {
                $state.go('home');
                emptyFormFields();
            } else if (response.data.responseCode == "02") {
                swal('User Not Found. Pls signup');
                emptyFormFields();
            } else if (response.data.responseCode == "03") {
                swal('Incorrect Password. Pls check password');
                emptyFormFields();
            }
        }, function (err) {
            console.log(JSON.stringify(err));
        });

    }

})

app.controller('assetController', function ($scope, $rootScope, $http) {

    var refresh = function () {

        $http.get('/assets').then(function (response) {

            $scope.assets = response.data.assets;

            $scope.task = {};

        });

    }

    refresh();

    $scope.onFinishWizard = function (asset) {

        var data = asset;

        var datum = {
            'asset_name': data.name,
            'asset_model': data.model,
            'asset_serial_number': data.serial_number,
            'asset_manufacturer': data.manufacturer,
            'asset_status': data.status,
            'asset_purchase_date': data.purchase_date,
            'asset_type': data.type,
            'asset_price': data.price,
            'asset_expiry_date': data.expiry_date
        }

        $http.post('/assets', datum).then(function (response) {
            if (response.data.responseCode == "00") {
                swal('Your Asset has been saved');
                // emptyFormFields();
                $state.go('allassets')
            } else if (response.data.responseCode == "02") {
                swal('Asset already exists');
                emptyFormFields();
            } else {
                swal('Error adding Asset');
                emptyFormFields();
            }
            console.log(JSON.stringify(response));
        }, function (err) {
            console.log(JSON.stringify(err));
        })


    }

    $scope.deleteAsset = function (id) {

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result === true) {
                console.log(id);
                $http.delete('/assets/' + id).then(function (response) {
                    console.log(response);
                    refresh();
                })
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

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