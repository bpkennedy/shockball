'use strict';

/**
* @ngdoc overview
* @name shockballApp
* @description
* # shockballApp
*
* Main module of the application.
*/
// get ag-Grid to create an Angular module and register the ag-Grid directive
agGrid.initialiseAgGridWithAngular1(angular);

angular
.module('shockballApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'chart.js',
    'agGrid',
    'firebase',
    'dcbImgFallback',
    'angularMoment',
    'ui.select',
    'moment-picker',
    'oitozero.ngSweetAlert'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('root', {
        abstract:true,
        url: '',
        views: {
            'titleBar@': {
                templateUrl: 'views/titleBar.html',
                controller: 'TitleBarCtrl',
                controllerAs: 'vm'
            },
            'presencePanel@': {
                templateUrl: 'views/presence.html',
                controller: 'PresenceCtrl',
                controllerAs: 'vm'
            }
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            'currentUser': ['auth', function(auth) {

                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return auth.$waitForSignIn();

            }]
        }
    })
    .state('root.dashboard', {
        url:'/',
        views: {
            'container@': {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.admin', {
        url: '/admin',
        views: {
            'container@': {
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl',
                controllerAs: 'vm'
            }
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.player', {
        url:'/player/:playerId',
        parent: 'root',
        views: {
            'container@': {
                templateUrl: 'views/player.html',
                controller: 'PlayerCtrl',
                controllerAs: 'vm'
            }
        },
        params: {
            isPlayer: null
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.playerCreate', {
        url:'/playerCreate',
        parent: 'root',
        views: {
            'container@': {
                templateUrl: 'views/playerCreate.html',
                controller: 'PlayerCreateCtrl',
                controllerAs: 'vm'
            }
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.team', {
        url:'/team/:teamId',
        parent: 'root',
        views: {
            'container@': {
                templateUrl: 'views/team.html',
                controller: 'TeamCtrl',
                controllerAs: 'vm'
            }
        },
        params: {
            isTeam: null
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.league', {
        url:'/league',
        parent: 'root',
        views: {
            'container@': {
                templateUrl: 'views/league.html',
                controller: 'LeagueCtrl',
                controllerAs: 'vm'
            }
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.events', {
        url:'/events',
        views: {
            'container@': {
                templateUrl: 'views/events.html',
                controller: 'EventsCtrl',
                controllerAs: 'vm'
            }
        },
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            'auth': 'auth',
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentUser": ["auth", function(auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $routeChangeError (see above)
                return auth.$requireSignIn();
            }]
        }
    })
    .state('root.login', {
        url:'/login',
        views: {
            'container@': {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.signup', {
        url:'/signup',
        views: {
            'container@': {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.forgotpassword', {
        url:'/forgotpassword',
        views: {
            'container@': {
                templateUrl: 'views/forgotpassword.html',
                controller: 'ForgotpasswordCtrl',
                controllerAs: 'vm'
            }
        }
    });
})
.run(['$rootScope', 'firebaseSvc', '$state', 'presence', 'iziToast', function ($rootScope, firebaseSvc, $state, presence, iziToast) {
    iziToast.init();
    firebaseSvc.initialize();
    presence.init();

    // for authentication, managing the state if error..
    $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {

        // if the error is "NO USER" the go to login state
        if (error === 'NO USER' || error === 'AUTH_REQUIRED') {
            event.preventDefault();
            $state.go('root.login', {});
        }
    });

}])
.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
        maintainAspectRatio: true,
        responsive: true
    });
    //cache every http request
    // $httpProvider.defaults.cache = true;
}]);
