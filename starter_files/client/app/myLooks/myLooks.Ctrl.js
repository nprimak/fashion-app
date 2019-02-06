(function() {
    'use strict';

    angular
        .module('app')
        .controller('MyLooksCtrl', MyLooksCtrl);

    MyLooksCtrl.$inject = ['$scope', '$modal', '$state', '$alert', 'looksAPI', 'Auth'];

    function MyLooksCtrl($scope, $modal, $state, $alert, looksAPI, Auth) {
        $scope.user = Auth.getCurrentUser();
        var userEmail = $scope.user.email;

        $scope.userLooks = [];
        $scope.editLook = {};

        var alertFailure = $alert({
            title: 'Not Saved',
            content: 'Look has failed to save',
            placement: 'top-right',
            container: '#alertContainer',
            type: 'warning',
            duration: 8
        });

        var alertSuccess = $alert({
            title: 'Saved',
            content: 'Look has been edited',
            placement: 'top-right',
            container: '#alertContainer',
            type: 'success',
            duration: 8
        });

        var myModal = $modal({
            scope: $scope,
            show: false
        })

        $scope.showModal = function() {
            myModal.$promise.then(myModal.show);
        }

        $scope.noLooks = function(){
            $scope.userLooks.length === 0;
        }

        looksAPI.getUserLooks(userEmail)
            .then(function(data) {
                console.log(data);
                $scope.userLooks = data.data;
            })
            .catch(function(err) {
                console.log('Failed to retrieve looks');
                console.log(err);
            })

        $scope.editLook = function(look) {
            looksAPI.getUpdateLook(look)
                .then(function(data) {
                    console.log(data);
                    $scope.editLook = data.data;
                })
                .catch(function(err) {
                    console.log('Failed to edit look');
                    console.log(err);
                })
        }

        $scope.saveLook = function() {
            var look = $scope.editLook;

            looksAPI.updateLook(look)
                .then(function(data) {
                    console.log('Look updated');
                    console.log(data);
                    $scope.editLook.title = '';
                    $scope.editLook.description = '';
                    alertSuccess.show();
                })
                .catch(function(err) {
                    console.log('Failed to update');
                    console.log(err);
                    alertFailure.show();
                })
                .finally(function() {
                    $scope.getUserLooks();
                    $state.go('mylooks');
                })
        }
    }
})();