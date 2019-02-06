(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'looksAPI', 'scrapeAPI', '$alert', 'Upload'];

  function MainCtrl($scope, $state, Auth, $modal, looksAPI, scrapeAPI, $alert, Upload) {
    $scope.user = Auth.getCurrentUser();
    $scope.look = {};
    $scope.looks = [];
    $scope.showScrapeDetails = false;
    $scope.showScrapeResults = false;
    $scope.loading = false;

    $scope.picPreview = true;
    $scope.scrapePostForm = true;
    $scope.uploadLookTitle = true;

    var alertSuccess = $alert({
        title: 'Success!',
        content: 'New Look Added',
        placement: 'top-right',
        container: '#alertContainer',
        type: 'success',
        duration: 8
    });

    var alertFail = $alert({
        title: 'Error While Saving',
        content: 'New Look Failed to Save',
        placement: 'top-right',
        container: '#alertContainer',
        type: 'warning',
        duration: 8
    });

    var myModal = $modal({
        scope: $scope,
        show: false
    })

    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    };

    $scope.showUploadForm = function() {
        $scope.uploadLookForm = true;
        $scope.scrapePostForm = false;
        $scope.uploadLookTitle = false;
    }

    looksAPI.getAllLooks()
        .then(function(data) {
            console.log(data);
            $scope.looks = data.data;
        })
        .catch(function(err) {
            console.log('Failed to retrieve looks!', err);
        })

    // Watch for changes to URL, Scrape, and Display Results
      $scope.$watch('look.link', function(newVal, oldVal){
        if(newVal.length > 5) {
            $scope.loading = true;
            var link = {
                url: $scope.look.link
            }
            scrapeAPI.getScrapeDetails(link)
                .then(function (data) {
                    console.log(data);
                    $scope.showScrapeDetails = true;
                    $scope.gotScrapeResults = true;
                    $scope.uploadLookTitle = false;
                    $scope.look.imgThumb = data.data.img;
                    $scope.look.description = data.data.desc;

                })
                .catch(function (data) {
                    console.log('Failure to scrape', data);
                    $scope.loading = false;
                    $scope.look.link = "";
                    $scope.gotScrapeResults = false;
                })
                .finally(function () {
                    $scope.loading = false;
                    $scope.uploadLookForm = false;
                })
        }
      })

      $scope.addScrapePost = function() {
        var look  = {
            description: $scope.look.description,
            title: $scope.look.title,
            image: $scope.look.imgThumb,
            email: $scope.user.email,
            name: $scope.user.name,
            _creator: $scope.user._id

        }
        looksAPI.createScrapeLook(look)
        .then(function(data) {
                alertSuccess.show();
                $scope.showScrapeDetails = false;
                $scope.gotScrapeResults = false;
                $scope.look.title = '';
                $scope.look.link = '';
                $scope.looks.splice(0,0, data.data);
                console.log(data);
            })
            .catch(function() {
                alertFail.show();
                console.log('Failed to post look data');
                $scope.showScrapeDetails = false;
            })
      }
      $scope.uploadPic = function(file) {
        Upload.upload({
            url: 'api/look/upload',
            headers: {
                'Content-Type':  'multipart/form-data'
            },
            data:  {
                file: file,
                title: $scope.look.title,
                description: $scope.look.description,
                email: $scope.user.email,
                name: $scope.user.name,
                linkURL: $scope.look._id,
                _creator: $scope.user._id

            }
        }).then(function(resp) {
            console.log("Upload successful");
            $scope.looks.splice(0,0, resp.data);
            $scope.look.title = '';
            $scope.look.description = '';
            $scope.picFile = '';
            $scope.picPreview = false;
            alertSuccess.show();
        }, function(resp) {
            alertFail.show();
        }, function(evt) {
            var progressPercentage = parseInt(100.00 * evt.loaded/evt.total);
            console.log('Upload progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        })
      }
  }
})();