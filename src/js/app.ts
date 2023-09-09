const $clock = document.getElementById("clock");
const $btn = document.querySelector(".btn");
const $nameInput: HTMLInputElement = document.getElementById(
    "task-name"
) as HTMLInputElement;
const $descInput: HTMLInputElement = document.getElementById(
    "task-description"
) as HTMLInputElement;
const $dateInput: HTMLInputElement = document.getElementById(
    "task-date"
) as HTMLInputElement;
const $taskForm = document.getElementById("task-form");
const $nameInputEdit: HTMLInputElement = document.getElementById(
    "task-name-edit"
) as HTMLInputElement;
const $descInputEdit: HTMLInputElement = document.getElementById(
    "task-description-edit"
) as HTMLInputElement;
const $dateInputEdit: HTMLInputElement = document.getElementById(
    "task-date-edit"
) as HTMLInputElement;
const $taskFormEdit = document.querySelector(".edit-section");
const $overlay = document.querySelector(".overlay");
const $plannedTasks = document.getElementById("planned-tasks");
const $doneTasks = document.getElementById("done-tasks");

interface TaskInterface {
    name: string;
    description: string;
    plannedDate: string;
    active: boolean;
    doneDate: string | null;
}

class Task implements TaskInterface {
    name: string;
    description: string;
    plannedDate: string;
    active: boolean;
    doneDate: string | null;

    constructor(name: string, description: string, date: string) {
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
        if ($taskForm) {
            $taskForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addNewTask();
            });
        }
        this.setDateInput();
        this.renderTasks();
        this.plannedTasks = [
            ...JSON.parse(localStorage.getItem("tasks") || "{}").filter(
                (task: Task) => task.active
            ),
        ];
        this.doneTasks = [
            ...JSON.parse(localStorage.getItem("tasks") || "{}").filter(
                (task: Task) => !task.active
            ),
        ];
        console.log(this.plannedTasks);
    }

    addNewTask() {
        const taskName: string = $nameInput.value;
        const taskDesc: string = $descInput.value;
        const taskDate: string | null = $dateInput.value;

        if (!taskName || !taskDate) {
            alert("Uzupełnij wszystkie pola!");
            return;
        }
        const newTask = new Task(taskName, taskDesc, taskDate);

        let dataFormLocalStorage = [];
        if (localStorage.getItem("tasks")) {
            dataFormLocalStorage = JSON.parse(
                localStorage.getItem("tasks") || "{}"
            );
        }

        this.plannedTasks.push(newTask);
        console.log(newTask);
        this.saveTaskToLocalStorage(newTask);
        this.updatePlannedTasksList();

        $nameInput.value = $descInput.value = "";
        this.setDateInput();
    }

    // EVENT LISTENERS

    addDoneButtonListeners() {
        const doneButtons = document.querySelectorAll(".btn-done");

        doneButtons.forEach((btn) => {
            (btn as HTMLButtonElement).addEventListener(
                "click",
                (e: MouseEvent) => {
                    e.preventDefault();
                    this.markTaskAsDone(e);
                }
            );
        });
    }

    addDeleteButtonListener() {
        const deleteButtons = document.querySelectorAll(".btn-delete");

        deleteButtons.forEach((btn) => {
            (btn as HTMLButtonElement).addEventListener("click", (e) => {
                e.preventDefault();
                this.deleteTask(e);
            });
        });
    }

    addReturnButtonListener() {
        const returnButtons = document.querySelectorAll(".btn-return");

        returnButtons.forEach((btn) => {
            (btn as HTMLButtonElement).addEventListener("click", (e) => {
                e.preventDefault();
                this.markTaskAsUndone(e);
            });
        });
    }

    addEditButtonListener() {
        const editButtons: NodeListOf<HTMLButtonElement> =
            document.querySelectorAll(
                ".btn-edit"
            ) as NodeListOf<HTMLButtonElement>;

        editButtons.forEach((btn) => {
            (btn as HTMLButtonElement).addEventListener("click", (e) => {
                e.preventDefault();
                this.editTask(e);
                btn.blur();
            });
        });
    }

    updatePlannedTasksList() {
        if ($plannedTasks) {
            $plannedTasks.innerHTML = "";
        }

        this.plannedTasks
            .filter((task) => task.active)
            .forEach((task, index) => {
                this.updateTaskHtml(task, index);
            });

        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    }

    updateDoneTasksList() {
        if ($doneTasks) {
            $doneTasks.innerHTML = "";
        }

        this.doneTasks
            .filter((task) => !task.active)
            .forEach((task, index) => {
                this.updateTaskHtml(task, index);
            });
    }

    // DATES

    padTo2Digits(num: number) {
        return num.toString().padStart(2, "0");
    }

    formatDate(date = new Date()) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
        ].join("-");
    }

    setDateInput() {
        $dateInput.value = this.formatDate();
    }

    // LOCAL STORAGE

    saveTaskToLocalStorage(task: Task) {
        let dataFromLocalStorage = [];
        if (localStorage.getItem("tasks")) {
            dataFromLocalStorage = JSON.parse(
                localStorage.getItem("tasks") || "{}"
            );
            dataFromLocalStorage.push(task);
            localStorage.setItem("tasks", JSON.stringify(dataFromLocalStorage));
        } else {
            dataFromLocalStorage.push(task);
            localStorage.setItem("tasks", JSON.stringify(dataFromLocalStorage));
        }
    }

    /////////////////

    renderTasks() {
        const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");

        allTasks.forEach((task: Task) => {
            this.plannedTasks.push(task);
        });

        this.renderAllTasks(allTasks, false);
        this.renderAllTasks(allTasks, true);
        this.addDoneButtonListeners();
        this.addDeleteButtonListener();
        this.addReturnButtonListener();
        this.addEditButtonListener();
    }

    renderAllTasks(array: Task[], ifActive: boolean) {
        array
            .filter((task) => {
                return task.active === ifActive;
            })
            .forEach((task, i) => {
                this.updateTaskHtml(task, i);
            });
    }

    updateTaskHtml(task: Task, index: number) {
        const { name, description: desc, plannedDate, active, doneDate } = task;
        const html = active
            ? `<div class="card mt-5">
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
            </div>`
            : `<div class="card mt-5">
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
            </div>`;

        active
            ? $plannedTasks?.insertAdjacentHTML("beforeend", html)
            : $doneTasks?.insertAdjacentHTML("beforeend", html);
    }

    updateTasksList() {
        this.updateDoneTasksList();
        this.updatePlannedTasksList();
        const allTasks = [...this.plannedTasks, ...this.doneTasks];
        localStorage.setItem("tasks", JSON.stringify(allTasks));
    }

    // TASKS ACTIONS

    changeActiveStatus(task: Task) {
        task.active ? (task.active = false) : (task.active = true);
    }

    markTaskAsDone(event: MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const dataId = +(
            target?.parentElement?.parentElement?.previousElementSibling?.getAttribute(
                "data-id"
            ) || ""
        );
        this.changeActiveStatus(this.plannedTasks[dataId]);
        this.plannedTasks[dataId].doneDate = this.formatDate();
        this.doneTasks.push(this.plannedTasks[dataId]);
        this.plannedTasks.splice(dataId, 1);
        this.updateTasksList();
    }

    markTaskAsUndone(event: MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const dataId = +(
            target?.parentElement?.parentElement?.previousElementSibling?.getAttribute(
                "data-id"
            ) || ""
        );

        const task = this.doneTasks[dataId];

        this.changeActiveStatus(task);
        task.doneDate = null;
        this.plannedTasks.push(task);
        this.doneTasks.splice(dataId, 1);
        this.updateTasksList();
    }

    deleteTask(event: MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const dataId = +(
            target.parentElement?.parentElement?.previousElementSibling?.getAttribute(
                "data-id"
            ) || ""
        );
        const targetArray = String(
            target.parentElement?.parentElement?.parentElement?.parentElement
                ?.id
        );
        if (targetArray === "planned-tasks") {
            this.plannedTasks.splice(dataId, 1);
            this.updateTasksList();
        } else {
            this.doneTasks.splice(dataId, 1);
            this.updateTasksList();
        }
    }

    editTask(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target) return;

        let dataId: number = +(
            target?.parentElement?.parentElement?.previousElementSibling?.getAttribute(
                "data-id"
            ) || ""
        );

        this.showEditForm();
        $nameInputEdit.value = this.plannedTasks[dataId].name;
        $descInputEdit.value = this.plannedTasks[dataId].description;
        $dateInputEdit.value = this.plannedTasks[dataId].plannedDate;

        const $closeBtn = document.querySelector(".close-modal");

        if ($closeBtn) {
            $closeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeEditForm();
            });
        }

        if ($overlay) {
            $overlay.addEventListener("click", () => {
                this.closeEditForm();
            });
        }

        document.addEventListener("keydown", (e) => {
            if (
                e.key === "Escape" &&
                !$taskFormEdit?.classList.contains("hidden")
            ) {
                this.closeEditForm();
            }
        });

        if ($taskFormEdit) {
            $taskFormEdit.addEventListener("submit", (e) => {
                e.preventDefault();
                this.submitEdition(dataId);
                dataId = 0;
            });
        }
    }

    submitEdition(dataId: number) {
        const taskToEdit = this.plannedTasks[dataId];
        taskToEdit.name = $nameInputEdit.value;
        taskToEdit.description = $descInputEdit.value;
        taskToEdit.plannedDate = $dateInputEdit.value;

        this.plannedTasks[dataId] = new Task(
            taskToEdit.name,
            taskToEdit.description,
            taskToEdit.plannedDate
        );
        this.updateTasksList();

        this.closeEditForm();
    }

    showEditForm() {
        $taskFormEdit?.classList.remove("hidden");
        $taskFormEdit?.classList.add("fade-in");

        $overlay?.classList.remove("hidden");
        $overlay?.classList.add("fade-in");
    }

    closeEditForm() {
        $taskFormEdit?.classList.add("hidden");
        $overlay?.classList.add("hidden");
    }
}

const app = new App();
