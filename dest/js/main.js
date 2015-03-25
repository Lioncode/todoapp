 angular.module('AntnrTodos',['ngAnimate'])

    .factory('AntnrServices',function(){
        var service = {
            todos: [],

            saveState : function(){
                localStorage.AntnrServices = angular.toJson(service);
            },

            restoreState: function () {
                if(localStorage.AntnrServices){
                    service.todos = angular.fromJson(localStorage.AntnrServices).todos;
                } else {
                    var sample = {"todos":[{"title":"Task One","status":"Secondary","isChecked":false,"label":"label-info","statusOrder":2},{"title":"Task Three","status":"Primary","isChecked":false,"label":"label-warning","statusOrder":1,"edit":false},{"title":"Do Something","status":"Secondary","isChecked":false,"label":"label-info","statusOrder":2},{"title":"Finished task","status":"Finished","isChecked":true,"label":"label-success","statusOrder":4}]};
                    service.todos = angular.fromJson(sample.todos);
                }
            },

            addTask : function(data) {
                service.todos.push(data);
            },

            deleteTask: function(id){
                this.todos.splice(id,1);
            }
        }
        return service;
    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .controller('todoCtrl',function($scope,$filter,AntnrServices){
        var statusId = 0;
        var statusOrder = 0;
        var statusMessage = '';
        var statusLabel   = 'label-primary';
        var reverse = true;

        AntnrServices.restoreState();

        if(AntnrServices.restoreState){
            $scope.tasks = AntnrServices.todos;
        }

        function save(){
            AntnrServices.saveState();
            $scope.tasks = AntnrServices.todos;
        }

        $scope.checked = function(task){
            if(task.isChecked) {
                task.status         = 'Finished';
                task.label          = 'label-success';
                task.statusOrder    = 4; 
            }else if (task.isChecked == false) {
                task.status = 'Todo';
                task.label  = 'label-default';
            }
            AntnrServices.saveState();
        }               

        $scope.add = function(task) {
            
            if(task.length > 3) {

                var taskItem = {                           
                    title:task,
                    status: 'Todo', 
                    isChecked: false,
                    label: 'label-default',
                    statusOrder: 3
                };

                AntnrServices.addTask(taskItem);
                $scope.taskInput = ""; //Clear input
                save();
            }
        }

        $scope.delete = function(id) {
            AntnrServices.deleteTask(id);
            save();
        }

        $scope.edit = function(id){
            $scope.tasks[id].edit = false;
            save();
        }
        
        $scope.changeStatus = function(index){

            if(!($scope.tasks[index].status == 'Finished')){

                //Every click change the current status
                if(statusId > 1) {
                    statusId = 0;
                } else {
                    statusId++;
                }

                switch(statusId){
                    case 0:
                        statusMessage = 'Todo';
                        statusLabel   = 'label-default';
                        statusOrder   = 3;
                        break;
                    case 1:
                        statusMessage = 'Primary';
                        statusLabel   = 'label-warning';
                        statusOrder   = 1;
                        break;
                    case 2:
                        statusMessage = 'Secondary';
                        statusLabel   = 'label-info';
                        statusOrder   = 2;
                        break;
                }

                $scope.tasks[index].status      = statusMessage;
                $scope.tasks[index].label       = statusLabel;
                $scope.tasks[index].statusOrder = statusOrder;
                save();
            }
        }

        $scope.sortOrderStatus = function(tasks){
            reverse = !reverse;
            //$scope.tasks = $filter('orderBy')(tasks, 'statusOrder',reverse);
            $scope.tasks = $filter('orderBy')(AntnrServices.todos,'statusOrder',reverse);
        }

    });