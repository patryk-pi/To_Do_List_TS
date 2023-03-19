var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var $clock = document.getElementById('clock');
var $btn = document.querySelector('.btn');
var $nameInput = document.getElementById('task-name');
var $descInput = document.getElementById('task-description');
var $dateInput = document.getElementById('task-date');
var $taskForm = document.getElementById('task-form');
var $nameInputEdit = document.getElementById('task-name-edit');
var $descInputEdit = document.getElementById('task-description-edit');
var $dateInputEdit = document.getElementById('task-date-edit');
var $taskFormEdit = document.querySelector('.edit-section');
var $overlay = document.querySelector('.overlay');
var $plannedTasks = document.getElementById('planned-tasks');
var $doneTasks = document.getElementById('done-tasks');
/*
// CLOCK
const updateDate = () => {
    const interval = setInterval(() => {
        currentTime();
    }, 1000)
}

const currentTime =() => {
    $clock.innerHTML ='';
    const date = (new Date());
    const html = `<p class="lead">${new Date().toLocaleDateString()}</p>
                    <p class="lead">${new Date().toLocaleTimeString()}</p>`
    $clock.insertAdjacentHTML('beforeend', html);
}

updateDate();
currentTime();*/
var Task = /** @class */ (function () {
    function Task(name, description, date) {
        this.name = name;
        this.description = description;
        this.plannedDate = date;
        this.active = true;
        this.doneDate = null;
    }
    return Task;
}());
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.plannedTasks = [];
        this.doneTasks = [];
        $taskForm.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.addNewTask();
        });
        this.setDateInput();
        this.renderTasks();
        this.plannedTasks = __spreadArray([], JSON.parse(localStorage.getItem("tasks")).filter(function (task) { return task.active === true; }), true);
        this.doneTasks = __spreadArray([], JSON.parse(localStorage.getItem("tasks")).filter(function (task) { return task.active === false; }), true);
        console.log(this.plannedTasks);
    }
    App.prototype.addNewTask = function () {
        var taskName = $nameInput.value;
        var taskDesc = $descInput.value;
        var taskDate = $dateInput.value;
        if (!taskName || !taskDate) {
            alert('Uzupełnij wszystkie pola!');
            return;
        }
        var newTask = new Task(taskName, taskDesc, taskDate);
        var dataFormLocalStorage = [];
        if (localStorage.getItem('tasks') !== null) {
            dataFormLocalStorage = JSON.parse(localStorage.getItem("tasks"));
        }
        this.plannedTasks.push(newTask);
        console.log(newTask);
        this.saveTaskToLocalStorage(newTask);
        this.updatePlannedTasksList();
        $nameInput.value = $descInput.value = '';
        this.setDateInput();
    };
    // EVENT LISTENERS
    App.prototype.addDoneButtonListeners = function () {
        var _this = this;
        var doneButtons = document.querySelectorAll('.btn-done');
        doneButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                _this.markTaskAsDone(e);
            });
        });
    };
    App.prototype.addDeleteButtonListener = function () {
        var _this = this;
        var deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                _this.deleteTask(e);
            });
        });
    };
    App.prototype.addReturnButtonListener = function () {
        var _this = this;
        var returnButtons = document.querySelectorAll('.btn-return');
        returnButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                _this.markTaskAsUndone(e);
            });
        });
    };
    App.prototype.addEditButtonListener = function () {
        var _this = this;
        var editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                _this.editTask(e);
                btn.blur();
            });
        });
    };
    App.prototype.updatePlannedTasksList = function () {
        var _this = this;
        $plannedTasks.innerHTML = '';
        this.plannedTasks.filter(function (task) { return task.active === true; }).forEach(function (task, index) {
            _this.updateTaskHtml(task, index);
        });
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    };
    App.prototype.updateDoneTasksList = function () {
        var _this = this;
        $doneTasks.innerHTML = '';
        this.doneTasks.filter(function (task) { return task.active === false; }).forEach(function (task, index) {
            _this.updateTaskHtml(task, index);
        });
    };
    // DATES
    App.prototype.padTo2Digits = function (num) {
        return num.toString().padStart(2, '0');
    };
    App.prototype.formatDate = function (date) {
        if (date === void 0) { date = new Date(); }
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
        ].join('-');
    };
    App.prototype.setDateInput = function () {
        $dateInput.value = this.formatDate();
    };
    // LOCAL STORAGE
    App.prototype.saveTaskToLocalStorage = function (task) {
        var dataFromLocalStorage = [];
        if (localStorage.getItem('tasks') !== null) {
            dataFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage));
        }
        else {
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage));
        }
    };
    /////////////////
    App.prototype.renderTasks = function () {
        var _this = this;
        var allTasks = JSON.parse(localStorage.getItem("tasks"));
        allTasks.forEach(function (task) {
            _this.plannedTasks.push(task);
        });
        this.renderAllTasks(allTasks, false);
        this.renderAllTasks(allTasks, true);
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    };
    App.prototype.renderAllTasks = function (array, ifActive) {
        var _this = this;
        array.filter(function (task) {
            return task.active === ifActive;
        }).forEach(function (task, i) {
            _this.updateTaskHtml(task, i);
        });
    };
    App.prototype.updateTaskHtml = function (task, index) {
        var name = task.name, desc = task.description, plannedDate = task.plannedDate, active = task.active, doneDate = task.doneDate;
        var html = active === true ?
            "<div class=\"card mt-5\">\n                <div class=\"card-body\" data-id=\"".concat(index, "\">\n                    <h5 class=\"card-title\">").concat(name, "</h5>\n                    <p class=\"card-text\">").concat(desc, " </p>\n                </div>\n                <div class=\"card-footer d-flex justify-content-around align-items-center flex-column flex-lg-row\">\n                    \n                    <small class=\"text-muted col-sm mb-2 mb-lg-0\">Zaplanowana data wykonania: <br>").concat(plannedDate, "</small>\n                    <div class=\"btn-group col-sm\" role=\"group\" >\n                        <button type=\"button\" class=\"btn btn-success btn-done\">Wykonano</button>\n                        <button type=\"button\" class=\"btn btn-outline-warning btn-edit\">Edytuj</button>\n                        <button type=\"button\" class=\"btn btn-outline-danger btn-delete\">Usu\u0144</button>\n                    </div> \n                </div>\n            </div>") :
            "<div class=\"card mt-5\">\n                <div class=\"card-body\" data-id=\"".concat(index, "\">\n                    <h5 class=\"card-title\">").concat(name, "</h5>\n                    <p class=\"card-text\">").concat(desc, " </p>\n                </div>\n                <div class=\"card-footer d-flex justify-content-around align-items-center flex-column flex-lg-row\">\n                    <small class=\"text-muted col-sm mb-2 mb-lg-0\">Wykonano: ").concat(doneDate, "</small>\n                    <div class=\"btn-group\" role=\"group\" >\n                        <button type=\"button\" class=\"btn btn-outline-success btn-return\">Przywr\u00F3\u0107 do zaplanowanych</button>\n                        <button type=\"button\" class=\"btn btn-outline-danger btn-delete\">Usu\u0144</button>\n                    </div>\n                </div>\n            </div>");
        active === true ? $plannedTasks.insertAdjacentHTML('beforeend', html) : $doneTasks.insertAdjacentHTML('beforeend', html);
    };
    App.prototype.updateTasksList = function () {
        this.updateDoneTasksList();
        this.updatePlannedTasksList();
        var allTasks = __spreadArray(__spreadArray([], this.plannedTasks, true), this.doneTasks, true);
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    };
    // TASKS ACTIONS
    App.prototype.changeActiveStatus = function (task) {
        task.active === true ? task.active = false : task.active = true;
    };
    App.prototype.markTaskAsDone = function (event) {
        var dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        this.changeActiveStatus(this.plannedTasks[dataId]);
        this.plannedTasks[dataId].doneDate = this.formatDate();
        this.doneTasks.push(this.plannedTasks[dataId]);
        this.plannedTasks.splice(dataId, 1);
        this.updateTasksList();
    };
    App.prototype.markTaskAsUndone = function (event) {
        var dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        this.changeActiveStatus(this.doneTasks[dataId]);
        this.doneTasks[dataId].doneDate = null;
        this.plannedTasks.push(this.doneTasks[dataId]);
        this.doneTasks.splice(dataId, 1);
        this.updateTasksList();
    };
    App.prototype.deleteTask = function (event) {
        var dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        var targetArray = String(event.target.parentElement.parentElement.parentElement.parentElement.id);
        if (targetArray === 'planned-tasks') {
            this.plannedTasks.splice(dataId, 1);
            this.updateTasksList();
        }
        else {
            this.doneTasks.splice(dataId, 1);
            this.updateTasksList();
        }
    };
    App.prototype.editTask = function (event) {
        var _this = this;
        var dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        this.showEditForm();
        $nameInputEdit.value = this.plannedTasks[dataId].name;
        $descInputEdit.value = this.plannedTasks[dataId].description;
        $dateInputEdit.value = this.plannedTasks[dataId].plannedDate;
        var $closeBtn = document.querySelector('.close-modal');
        console.log(this.plannedTasks[dataId]);
        $closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            _this.closeEditForm();
        });
        $overlay.addEventListener('click', function () {
            _this.closeEditForm();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && (!$taskFormEdit.classList.contains("hidden"))) {
                _this.closeEditForm();
            }
        });
        $taskFormEdit.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.submitEdition(dataId);
            dataId = null;
        });
    };
    App.prototype.submitEdition = function (dataId) {
        var taskToEdit = this.plannedTasks[dataId];
        taskToEdit.name = $nameInputEdit.value;
        taskToEdit.description = $descInputEdit.value;
        taskToEdit.date = $dateInputEdit.value;
        this.plannedTasks[dataId] = new Task(taskToEdit.name, taskToEdit.description, taskToEdit.date);
        this.updateTasksList();
        this.closeEditForm();
    };
    ;
    App.prototype.showEditForm = function () {
        $taskFormEdit.classList.remove('hidden');
        $taskFormEdit.classList.add('fade-in');
        $overlay.classList.remove('hidden');
        $overlay.classList.add('fade-in');
    };
    App.prototype.closeEditForm = function () {
        $taskFormEdit.classList.add('hidden');
        $overlay.classList.add('hidden');
    };
    return App;
}());
var app = new App;
