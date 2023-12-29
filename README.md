# To Do List Using Backbone.JS

A simple to-do list app using Backbone.js. The app will have the ability to add new tasks, mark tasks as complete, and delete tasks.


## Screenshots

![App Screenshot](https://i.ibb.co/y8S7NyJ/todolist-SS.jpg)

- Define a model for the task.
```
 var Task = Backbone.Model.extend({
    defaults: {
        task: "",
        description: "",
        status: "Pending" // Default status set to "Pending"
    }
});
```
- Define a collection for the task list.
```
 var Tasks = Backbone.Collection.extend({
    model: Task
});

```
- Define a view for the task.
```
var TaskView = Backbone.View.extend({
    tagName: 'tr', // Use table row as the HTML element for individual task
    template: _.template($('.tasks-list-template').html()), // Template for rendering a task


    initialize: function() {
        this.render();
    },


    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        if (this.model.get('status') === 'Finished') {
            this.$('.task-done').prop('checked', true);
        }
        return this;
    },


    events: {
        'change .task-done': 'toggleDone',
        'click .edit-task': 'editTask',
        'click .delete-task': 'deleteTask'
    },


    // Function to toggle task completion status
    toggleDone: function(event) {
        var isChecked = event.target.checked;
        if (isChecked) {
            this.model.set('status', 'Finished');
            this.$el.addClass('table-secondary'); // Add a styling for completed tasks
        } else {
            this.model.set('status', 'Pending');
            this.$el.removeClass('table-secondary');
        }
    },


    // Function to edit a task
    editTask: function() {
        var newTaskName = prompt('Edit Task Name:', this.model.get('task'));
        var newTaskDescription = prompt('Edit Task Description:', this.model.get('description'));


        if (newTaskName !== null && newTaskDescription !== null) {
            this.model.set({
                task: newTaskName.trim() || this.model.get('task'),
                description: newTaskDescription.trim() || this.model.get('description')
            });
            this.render();
        }
    },


    // Function to delete a task
    deleteTask: function() {
        if (confirm('Are you sure you want to delete this task?')) {
            this.model.destroy();
            this.remove();
        }
    }
});
```
- Define a view for the task list.
```
var TasksView = Backbone.View.extend({
    model: tasks,
    el: $('.tasks-list'),


    initialize: function() {
        this.model.on('add', this.render, this);
    },


    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(task) {
            self.$el.append((new TaskView({model: task})).render().$el);
        });
        return this;
    }
});

```
- Instantiate the task collection and views.
```
var tasks = new Tasks();
var tasksView = new TasksView();
```
-  Render the task list view and append it to the body of the document.
```
$(document).ready(function() {
    $('.add-btn').on('click', function() {
        var titleInput = $('.task-input').val().trim();
        var descriptionInput = $('.description-input').val().trim();


        if (titleInput === '' || descriptionInput === '') {
            alert('Title and Description cannot be empty!');
            return; // Stop execution if inputs are empty
        }


        var task = new Task({
            task: titleInput,
            description: descriptionInput,
            status: "Pending"
        });
        tasks.add(task);


        alert('New Task Added Successfully!');


        // Clear input fields after successfully adding a task
        $('.task-input').val('');
        $('.description-input').val('');
    });
});

```


