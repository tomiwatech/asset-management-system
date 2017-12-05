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

        .state('maintain', {
            url: '/maintain',
            views: {
                layout: {
                    templateUrl: "templates/maintain.html"
                }
            },
            controller: 'assetController',
        })

        .state('document', {
            url: '/document',
            views: {
                layout: {
                    templateUrl: "templates/document.html"
                }
            },
            controller: 'documentController',
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

app.controller('assetController', function ($scope, $rootScope, $http, $state) {

    var refresh = function () {

        $http.get('/assets').then(function (response) {

            $scope.assets = response.data.assets;

            $scope.task = {};

        });

        $http.get('/repairs').then(function (response) {

            $scope.repairs = response.data.repair;
            console.log($scope.repairs);

            $scope.task = {};

        });

    }

    refresh();

    $scope.onFinishWizard = function (asset) {

        // alert(JSON.stringify(asset))

        var data = asset;

        if (!data.name || !data.model || !data.serial_number || !data.manufacturer || !data.status || !data.purchase_date || !data.price || !data.expiry_date) {
            swal('Please Fill all fields');
            return;
        }

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

        //  alert(JSON.stringify(datum))

        $http.post('/assets', datum).then(function (response) {
            if (response.data.responseCode == "00") {
                swal('Your Asset has been saved');
                $state.go('allassets');
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
                    'Asset has been deleted.',
                    'success'
                )
            }
        })
    }

    $scope.reportAsset = function (assets) {
        var values = assets;

        if (!values.name || !values.model || !values.repair_cost || !values.description) {
            swal("Please You need to enter your repair information")
            return;
        }

        var data = {
            'asset_name': values.name,
            'asset_model': values.model,
            'asset_repair_cost': values.repair_cost,
            'asset_description': values.description
        }

        //  alert(JSON.stringify(datum))

        $http.post('/repairs', data).then(function (response) {
            if (response.data.responseCode == "00") {
                swal('Your Repair has been saved');
                // emptyFormFields();
                // $state.go('allassets')
                $rootScope.asset = {
                    name: "",
                    model: "",
                    repair_cost: "",
                    description: ""
                }
                refresh();
            } else if (response.data.responseCode == "02") {
                swal('Repair type already exists');
                emptyFormFields();
            } else {
                swal('Error adding Repair');
                emptyFormFields();
            }
            console.log(JSON.stringify(response));
        }, function (err) {
            console.log(JSON.stringify(err));
        })
    }

    $scope.deleteRepair = function (id) {

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
                $http.delete('/repairs/' + id).then(function (response) {
                    console.log(response);
                    refresh();
                })
                swal(
                    'Deleted!',
                    'Your Report has been deleted.',
                    'success'
                )
            }
        })
    }

    $scope.reportRepair = function (asset) {
        // https://formspree.io/your@email.com
        var report = asset;
        var reportData = {
            'asset_name': report.asset_name,
            'asset_model': report.asset_model,
            'asset_report_price': report.asset_report_price,
            'asset_description': report.asset_description
        }

        // alert(JSON.stringify(reportData))
        swal({
            title: 'Are you want to send this report to technician',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, send report to technician!'
        }).then((result) => {
            if (result === true) {
                $http.post('https://formspree.io/tomiwatech@gmail.com', reportData).then(function (response) {
                    // alert(JSON.stringify(response));
                    refresh();
                }, function (err) {
                    //   alert(JSON.stringify(err));
                })
                swal(
                    'Report Sent!',
                    'Your Report has been tracked.',
                    'success'
                )
            }
        })
    }



})

app.controller('homeController', function ($scope, $http) {

    var refresh = function () {

        $http.get('/assets/count').then(function (response) {

            $scope.total = response.data.total;

        });

        $http.get('/users/count').then(function (response) {

            $scope.totalAdmin = response.data.total;

        });

        $http.get('/assets').then(function (response) {

            $scope.assets = response.data.assets;

            // alert($scope.total)

            // alert(JSON.stringify($scope.worth))

            var sum = 0;
            for (var k = 0; k < $scope.total; k++) {
                sum = parseInt(sum) + parseInt(response.data.assets[k].asset_price);
            }

            $scope.assetWorth = sum;

        });

    }

    refresh();

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
                    'Asset has been deleted.',
                    'success'
                )
            }
        })
    }

});