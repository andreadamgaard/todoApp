//Skift til let når der kommer problemer
let task_array = [];
const itemCounter = document.querySelector("#item-counter");

let toDoListTasks = JSON.parse(localStorage.getItem("arrayoftasks"));
//Her sørger den for kun at hente fra localStorage hvis der er noget.
//Er der ikke noget, prøver den ikke at hente fra localStorage.
if (toDoListTasks !== null) {
  task_array = toDoListTasks;
  filterSortList();
}

document.querySelector("#makeNewToDo").addEventListener("click", newTask);

//Her laver vi vores task, på baggrund af hvad der står i vores textindput(todoInput)
function newTask(evt) {
  if (evt.target.type === "button") {
    makeNewTask(evt.currentTarget.querySelector("#todoInput").value);
    //Her laver vi den til en tom string når vi har lavet input
    evt.currentTarget.querySelector("#todoInput").value = "";
  }
}

function makeNewTask(name) {
  //Her er vores task, der inkl. navn, done og random id.
  const task = { taskName: name, done: false, id: self.crypto.randomUUID() };
  //Her pusher den den nye task op til vores array
  task_array.push(task);
  todoListen.value = "";
  //vi sætter det ind i vores liste
  filterSortList();
}

function filterSortList() {
  //Her vi sørger for at vores task array bliver vist i vores dom.
  //Hentet fra showList
  let listToShow;
  listToShow = task_array;
  showList();
}

function showList() {
  //Få vores liste vist i DOM'en
  //console.log("taskArray", task_array);
  const tbodyToDo = document.querySelector("#todoListen");
  const tbodyDone = document.querySelector("#doneListen");
  //Husk at tømme den
  tbodyToDo.innerHTML = "";
  tbodyDone.innerHTML = "";

  //Vi tager fat i vores array og filtrere hvilke tasks der ikke er blevet lavet.
  //Når vi har fat i dem sætter vi en length på, for at se hvor mange der er.
  const numberOfDone = task_array.filter((task) => task.done === false).length;
  //console.log("task_array.filter((task) => task.done !== task.done)", task_array.filter((task) => task.done === false));
  //Her sætter vi antalet af vores done tasks ind i vores html så den tæller vores tasks.
  itemCounter.textContent = `Hvor mange opgaver mangler du: ${numberOfDone}`;

  task_array.forEach((task) => {
    const clone = document.querySelector("template").content.cloneNode(true);
    //Vi tager fat i vores textfelt
    const tf = clone.querySelector("#textInput");
    //Her gemmer vi vores textContent, så det i vores array er task.task
    tf.textContent = task.taskName;

    //Tilføj delete button
    const deleteBtn = clone.querySelector("#deleteBtn");
    //Når vi klikker på delete knappen fjerner den vores task / kalder på function delete
    deleteBtn.addEventListener("click", () => {
      removeTask(task.id);
      filterSortList();
    });

    if (task.done) {
      //Når vores task er true er den under done.
      clone.querySelector("#toDoBtn").textContent = "Done";
    } else {
      //Når vores task er false er den under to do.
      clone.querySelector("#toDoBtn").textContent = "To do";
    }

    clone.querySelector("#toDoBtn").addEventListener("click", () => {
      task.done = !task.done;
      //toggle vores valg
      filterSortList();
    });
    localStorage.setItem("arrayoftasks", JSON.stringify(task_array));
    if (task.done) {
      tbodyDone.appendChild(clone);
    } else {
      tbodyToDo.appendChild(clone);
    }
  });
}

function removeTask(taskId) {
  const taskIndex = task_array.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    //Her fjerner vi vores task fra vores task_array
    task_array.splice(taskIndex, 1);

    //Vi køre den igennem vores localStorage for at sikre os
    //den forbliver fjernet når vi refresher vores side
    localStorage.setItem("arrayoftasks", JSON.stringify(task_array));
  }
}
