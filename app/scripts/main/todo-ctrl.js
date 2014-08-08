'use strict';

/*************************************************************************/
/* Copied liberally from the base AngularJS TodoMVC example              */
/* Credits: Christoph Burgdorf, Eric Bidelman, Jacob Mumm and Igor Minar */
/*************************************************************************/

angular.module('famous-angular-todomvc')
  .controller('TodoCtrl', function ($scope, $famous, $stateParams, $filter, todoStorage) {
    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Easing = $famous['famous/transitions/Easing'];

    var _decorateTodo = function(todo){
      todo.transform = {
        scale: new Transitionable([1, 1, 1]),
        translate: new Transitionable([0, 0, 1])
      }
    }

    var todos = $scope.todos = todoStorage.get();
    angular.forEach(todos, function(todo){
      _decorateTodo(todo);
    })

    $scope.$watch('todos', function (newValue, oldValue) {
      $scope.todoModel.remainingCount = $filter('filter')(todos, { completed: false }).length;
      $scope.todoModel.completedCount = todos.length - $scope.todoModel.remainingCount;
      $scope.todoModel.allChecked = !$scope.todoModel.remainingCount;
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        todoStorage.put(todos);
      }
    }, true);

    $scope.todoModel = {
      newTodo: '',
      editedTodo: null,
      originalTodo: {}    
    }
    $scope.todoModel.newTodo = '';
    $scope.todoModel.editedTodo = null;

    // Monitor the current route for changes and adjust the filter accordingly.
    $scope.$on('$stateChangeSuccess', function () {
      var status = $scope.status = $stateParams.status || '';

      $scope.statusFilter = (status === 'active') ?
        { completed: false } : (status === 'completed') ?
        { completed: true } : null;
    });

    $scope.addTodo = function (param) {
      var newTodo = $scope.todoModel.newTodo.trim();
      if (!newTodo.length) {
        return;
      }

      var newIndex = todos.length;
      var newTodo = {
        id: Math.random(),
        title: newTodo,
        completed: false
      };

      _decorateTodo(newTodo);

      todos.push(newTodo);

      $scope.todoModel.newTodo = '';
    };

    $scope.editTodo = function (todo) {
      $scope.todoModel.editedTodo = todo;
      // Clone the original todo to restore it on demand.
      $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.doneEditing = function (todo) {
      $scope.todoModel.editedTodo = null;
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



    $scope.animateIn = function(todo, $done){
      todo.transform.scale.set([.1, 1, 1]);
      todo.transform.scale.set([1, 1, 1], {duration: 500, curve: Easing.outBounce}, $done);
    };

    $scope.animateOut = function(todo, $done){
      todo.transform.translate.set([window.innerWidth, 0, 1], {duration: 1000, curve: Easing.inBounce}, $done);
    }

    var sizes = $scope.sizes = {
      header: {
        height: 65
      },
      topBar: {
        height: 15
      },
      todo: {
        height: 65
      },
      footer: {
        height: 20
      }
    };

    $scope.getTodoPosition = function(todo, index){
      return [0, index * sizes.todo.height, 1];
    }

    var layout = $scope.layout = {
      notepad: {
        height: function(){
          return  $filter('filter')(todos, $scope.statusFilter).length * sizes.todo.height + sizes.header.height + sizes.topBar.height;
        }
      },
      footer: {
        translate: function(){
          return [0, sizes.topBar.height + sizes.header.height + layout.notepad.height() + 50, 1];
        }
      }
    }

  });
