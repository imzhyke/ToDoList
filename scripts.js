// Backbone Model for a single task
var Task = Backbone.Model.extend({
    defaults: {
        task: "",
        description: "",
        status: "Pending" // Default status set to "Pending"
    }
});

// Backbone Collection for tasks
var Tasks = Backbone.Collection.extend({
    model: Task
});

// Instantiate a new collection to hold tasks
var tasks = new Tasks();


// Backbone View for rendering an individual task
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

// Backbone View for the entire task list
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

// Instantiate the main task list view
var tasksView = new TasksView();

// Event handler when "Add Task" button is clicked
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
