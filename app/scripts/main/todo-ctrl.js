'use strict';

/*************************************************************************/
/* Copied liberally from the base AngularJS TodoMVC example              */
/* Credits: Christoph Burgdorf, Eric Bidelman, Jacob Mumm and Igor Minar */
/*************************************************************************/

angular.module('famous-angular-todomvc')
  .controller('TodoCtrl', function ($scope, $famous, $stateParams, $filter, todoStorage) {
    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Timer = $famous['famous/utilities/Timer'];
    $scope.spinner = {
      speed: 200
    };
    $scope.rotateY = new Transitionable(0);

    //run function on every tick of the Famo.us engine
    Timer.every(function(){
      var adjustedSpeed = parseFloat($scope.spinner.speed) / 1200;
      $scope.rotateY.set($scope.rotateY.get() + adjustedSpeed);
    }, 1);



    var todos = $scope.todos = todoStorage.get();


    $scope.$watch('todos', function (newValue, oldValue) {
      $scope.todo.remainingCount = $filter('filter')(todos, { completed: false }).length;
      $scope.todo.completedCount = todos.length - $scope.todo.remainingCount;
      $scope.todo.allChecked = !$scope.todo.remainingCount;
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        todoStorage.put(todos);
      }
    }, true);



    $scope.todo = {
      newTodo: '',
      editedTodo: null,
      originalTodo: {}    
    }
    $scope.todo.newTodo = '';
    $scope.todo.editedTodo = null;

    // Monitor the current route for changes and adjust the filter accordingly.
    $scope.$on('$stateChangeSuccess', function () {
      var status = $scope.status = $stateParams.status || '';

      $scope.statusFilter = (status === 'active') ?
        { completed: false } : (status === 'completed') ?
        { completed: true } : null;
    });

    $scope.addTodo = function (param) {
      var newTodo = $scope.todo.newTodo.trim();
      console.log('new todo param', param)
      if (!newTodo.length) {
        return;
      }

      todos.push({
        id: Math.random(),
        title: newTodo,
        completed: false
      });

      $scope.todo.newTodo = '';
    };

    $scope.editTodo = function (todo) {
      $scope.todo.editedTodo = todo;
      // Clone the original todo to restore it on demand.
      $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.doneEditing = function (todo) {
      $scope.editedTodo = null;
      todo.title = todo.title.trim();

      if (!todo.title) {
        $scope.removeTodo(todo);
      }
    };

    $scope.revertEditing = function (todo) {
      todos[todos.indexOf(todo)] = $scope.originalTodo;
      $scope.doneEditing($scope.originalTodo);
    };

    $scope.removeTodo = function (todo) {
      todos.splice(todos.indexOf(todo), 1);
    };

    $scope.clearCompletedTodos = function () {
      $scope.todos = todos = todos.filter(function (val) {
        return !val.completed;
      });
    };

    $scope.markAll = function (completed) {
      todos.forEach(function (todo) {
        todo.completed = !completed;
      });
    };

    //PRESENTATION LOGIC

    var _sizes = $scope.sizes = {
      header: {
        height: 65
      },
      topBar: {
        height: 15
      },
      todo: {
        height: 65
      }
    };

    $scope.getNotepadHeight = function(){
      return  todos.length * _sizes.todo.height + _sizes.header.height + _sizes.topBar.height;
    }

    $scope.getTodoPosition = function(todo, index){
      return [0, index * _sizes.todo.height, 1];
    }

    

  });
