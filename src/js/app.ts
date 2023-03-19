const $clock = document.getElementById('clock');
const $btn = document.querySelector('.btn');
const $nameInput = document.getElementById('task-name');
const $descInput = document.getElementById('task-description')
const $dateInput = document.getElementById('task-date');
const $taskForm = document.getElementById('task-form');
const $nameInputEdit = document.getElementById('task-name-edit');
const $descInputEdit = document.getElementById('task-description-edit')
const $dateInputEdit = document.getElementById('task-date-edit');
const $taskFormEdit = document.querySelector('.edit-section');
const $overlay = document.querySelector('.overlay');
const $plannedTasks = document.getElementById('planned-tasks');
const $doneTasks = document.getElementById('done-tasks');


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

interface TaskInterface {
    name: string;
    description: string;
    plannedDate: string | Date;
    active: boolean;
    doneDate: Date | null | string;
}

class Task implements TaskInterface{

    name: string;
    description: string;
    plannedDate: string | Date;
    active: boolean;
    doneDate: Date | null | string;

    constructor(name: string, description: string, date: Date) {
        this.name = name;
        this.description = description;
        this.plannedDate = date;
        this.active = true;
        this.doneDate = null;
    }
}

class App {
    plannedTasks: Task[] = [];
    doneTasks: Task[] = [];

    constructor() {
        $taskForm.addEventListener('submit', e => {
            e.preventDefault();
            this.addNewTask();
        });
        this.setDateInput();
        this.renderTasks();
        this.plannedTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === true)];
        this.doneTasks = [...JSON.parse(localStorage.getItem("tasks")).filter(task => task.active === false)];
        console.log(this.plannedTasks);
    }


    addNewTask() {

        const taskName: string = $nameInput.value;
        const taskDesc: string = $descInput.value;
        const taskDate: Date = $dateInput.value;

        if (!taskName || !taskDate) {
            alert('Uzupełnij wszystkie pola!');
            return;
        }
        const newTask = new Task(taskName, taskDesc, taskDate);

        let dataFormLocalStorage = [];
        if (localStorage.getItem('tasks')) {
            dataFormLocalStorage = JSON.parse(localStorage.getItem("tasks"));
        }

        this.plannedTasks.push(newTask);
        console.log(newTask);
        this.saveTaskToLocalStorage(newTask)
        this.updatePlannedTasksList();

        $nameInput.value = $descInput.value = '';
        this.setDateInput();
    }

    // EVENT LISTENERS

    addDoneButtonListeners() {
        const doneButtons = document.querySelectorAll('.btn-done');

        doneButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault()
                this.markTaskAsDone(e);
            })
        })
    }

    addDeleteButtonListener() {
        const deleteButtons = document.querySelectorAll('.btn-delete');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault()
                this.deleteTask(e)
            })
        });
    }

    addReturnButtonListener() {
        const returnButtons = document.querySelectorAll('.btn-return');

        returnButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault()
                this.markTaskAsUndone(e);
            })
        })
    }

    addEditButtonListener() {
        const editButtons = document.querySelectorAll('.btn-edit');

        editButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                this.editTask(e);
                btn.blur();
            })
        })
    }

    updatePlannedTasksList() {
        $plannedTasks.innerHTML = '';

        this.plannedTasks.filter(task => task.active).forEach((task, index) => {
            this.updateTaskHtml(task, index);
        });

        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    }

    updateDoneTasksList() {
        $doneTasks.innerHTML = '';

        this.doneTasks.filter(task => !task.active).forEach((task, index) => {
            this.updateTaskHtml(task, index);
        });

    }


    // DATES

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date = new Date()) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
        ].join('-');
    }

    setDateInput() {
        $dateInput.value = this.formatDate();
    }

    // LOCAL STORAGE

    saveTaskToLocalStorage(task: Task) {
        let dataFromLocalStorage = [];
        if (localStorage.getItem('tasks') !== null) {
            dataFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage))
        } else {
            dataFromLocalStorage.push(task);
            localStorage.setItem('tasks', JSON.stringify(dataFromLocalStorage))
        }
    }

    /////////////////

    renderTasks() {
        const allTasks = JSON.parse(localStorage.getItem("tasks"));

        allTasks.forEach(task => {
            this.plannedTasks.push(task);
        })

        this.renderAllTasks(allTasks, false);
        this.renderAllTasks(allTasks, true);
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();

    }

    renderAllTasks(array: [], ifActive: boolean) {
        array.filter(task => {
            return task.active === ifActive;
        }).forEach((task, i) => {
                this.updateTaskHtml(task, i);
            }
        );
    }


    updateTaskHtml(task: object, index: number) {
        const {name, description: desc, plannedDate, active, doneDate} = task
        const html = active === true ?

            `<div class="card mt-5">
                <div class="card-body" data-id="${index}">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
                <div class="card-footer d-flex justify-content-around align-items-center flex-column flex-lg-row">
                    
                    <small class="text-muted col-sm mb-2 mb-lg-0">Zaplanowana data wykonania: <br>${plannedDate}</small>
                    <div class="btn-group col-sm" role="group" >
                        <button type="button" class="btn btn-success btn-done">Wykonano</button>
                        <button type="button" class="btn btn-outline-warning btn-edit">Edytuj</button>
                        <button type="button" class="btn btn-outline-danger btn-delete">Usuń</button>
                    </div> 
                </div>
            </div>` :

            `<div class="card mt-5">
                <div class="card-body" data-id="${index}">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${desc} </p>
                </div>
                <div class="card-footer d-flex justify-content-around align-items-center flex-column flex-lg-row">
                    <small class="text-muted col-sm mb-2 mb-lg-0">Wykonano: ${doneDate}</small>
                    <div class="btn-group" role="group" >
                        <button type="button" class="btn btn-outline-success btn-return">Przywróć do zaplanowanych</button>
                        <button type="button" class="btn btn-outline-danger btn-delete">Usuń</button>
                    </div>
                </div>
            </div>`

        active === true ? $plannedTasks.insertAdjacentHTML('beforeend', html) : $doneTasks.insertAdjacentHTML('beforeend', html);
    }

    updateTasksList() {
        this.updateDoneTasksList();
        this.updatePlannedTasksList();
        const allTasks = [...this.plannedTasks, ...this.doneTasks]
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }




    // TASKS ACTIONS

    changeActiveStatus(task: object) {
        task.active === true ? task.active = false : task.active = true;
    }

    markTaskAsDone(event) {

        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id')
        this.changeActiveStatus(this.plannedTasks[dataId])
        this.plannedTasks[dataId].doneDate = this.formatDate();
        this.doneTasks.push(this.plannedTasks[dataId]);
        this.plannedTasks.splice(dataId, 1)
        this.updateTasksList();
    }

    markTaskAsUndone(event) {

        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        this.changeActiveStatus(this.doneTasks[dataId]);
        this.doneTasks[dataId].doneDate = null;
        this.plannedTasks.push(this.doneTasks[dataId]);
        this.doneTasks.splice(dataId, 1)
        this.updateTasksList();
    }

    deleteTask(event) {
        const dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');
        const targetArray = String(event.target.parentElement.parentElement.parentElement.parentElement.id);
        if (targetArray === 'planned-tasks') {
            this.plannedTasks.splice(dataId, 1);
            this.updateTasksList();
        } else {
            this.doneTasks.splice(dataId, 1);
            this.updateTasksList();
        }
    }

    editTask(event) {
        let dataId = +event.target.parentElement.parentElement.previousElementSibling.getAttribute('data-id');

        this.showEditForm();
        $nameInputEdit.value = this.plannedTasks[dataId].name
        $descInputEdit.value = this.plannedTasks[dataId].description
        $dateInputEdit.value = this.plannedTasks[dataId].plannedDate;
        const $closeBtn = document.querySelector('.close-modal');

        $closeBtn.addEventListener('click', e=> {
            e.preventDefault();
            this.closeEditForm();
        });

        $overlay.addEventListener('click', () => {
            this.closeEditForm();
        });

        document.addEventListener("keydown", e=> {
            if (e.key === "Escape" && (!$taskFormEdit.classList.contains("hidden"))) {
                this.closeEditForm();
            }
        })


        $taskFormEdit.addEventListener('submit', e => {
            e.preventDefault();
            this.submitEdition(dataId)
            dataId = null;
        })
    }

    submitEdition(dataId: number | any) {
        const taskToEdit = this.plannedTasks[dataId];
        taskToEdit.name = $nameInputEdit.value;
        taskToEdit.description = $descInputEdit.value;
        taskToEdit.date = $dateInputEdit.value;


        this.plannedTasks[dataId] = new Task(taskToEdit.name, taskToEdit.description, taskToEdit.date);
        this.updateTasksList();


        this.closeEditForm();
    };

    showEditForm() {
        $taskFormEdit.classList.remove('hidden');
        $taskFormEdit.classList.add('fade-in');

        $overlay.classList.remove('hidden');
        $overlay.classList.add('fade-in');
    }

    closeEditForm() {
        $taskFormEdit.classList.add('hidden');
        $overlay.classList.add('hidden');
    }



}

const app = new App;



