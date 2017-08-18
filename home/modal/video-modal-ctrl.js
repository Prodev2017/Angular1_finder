(function (angular) {
    'use strict';
    angular
            .module('hfApp')
            .controller('videoModalCtrl', ['$scope',  '$uibModal',
                function ($scope, $uibModal) {                    
                    /*
                     * @author: ahextech
                     * @created: 02 dec 2016
                     * @params: no
                     * @return: no
                     * @purpose: close modal popup
                     */
                    
                    $scope.openVideoModal = function () {
                        console.log("videoModal");
                        $uibModal.open({
                            templateUrl: 'home/modal/video-modal.html',
                            controller: function($uibModalInstance){
                                function close() {
                                 $uibModalInstance.close('close');
                                }
                                $scope.videoAction = {
                        close: close
                    };
                            },
                            scope: $scope
                        });
                    };
                }]);


})(window.angular);