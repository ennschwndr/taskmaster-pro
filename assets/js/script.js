var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  taskLi.append(taskSpan, taskP);

  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  $.each(tasks, function(list, arr) {
    console.log(list, arr);

    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

$("#modalDueDate").datepicker({
  minDate: 1
});

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function() {

  var text = $(this)
    .val()
    .trim();

  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text)
    $(this).replaceWith(textInput)
    textInput.trigger("focus");

    var taskP = $("<p>")
      .addClass("m-1")
      .text(text);

    $(this).replaceWith(taskP);
    }    
);

$(".list-group").on("blur", "textarea", function(){

  var text = $(this)
    .text()
    .trim();
 
  var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", " ");

  var index = $(this)
      .closest(".list-group-item")
      .index();

  tasks[status][index].text = text;
  saveTasks();

  var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

  $(this).replaceWith(taskP);
});

$(".list-group").on("click", "span", function() {
    
    var date = $(this)
      .text()
      .trim();

    var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);

    $(this).replaceWith(dateInput);

    dateInput.datepicker({
      minDate: 1,
      onClose: function(){
        $(this).trigger("change")
      }
    });

    dateInput.trigger("focus");
});

$(".list-group").on("change", "input[type='text']", function() {
    
    var date = $(this)
      .val()
      .trim();

    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");

    var index = $(this)
      .closest(".list-group-item")
      .index();

    tasks[status][index].date = date;
    saveTasks();  

    var taskSpan = $("<span>")
      .addClass("badge badge-primary badge-pill")
      .text(date);

    $(this).replaceWith(taskSpan);
});

$("#task-form-modal").on("show.bs.modal", function() {

  $("#modalTaskDescription, #modalDueDate").val("");
});


$("#task-form-modal").on("shown.bs.modal", function() {

  $("#modalTaskDescription").trigger("focus");
});


$("#task-form-modal .btn-save").click(function() {

  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    $("#task-form-modal").modal("hide");

    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",

  activate: function(event) {
    $(this).addClass("dropover");
    $(this).addClass("botton-trash-drag");
  },
  deactivate: function(event) {
    $(this).remove("dropover");
    $(this).remove("bottom-trash-drag");
  },
  over: function(event) {
   $("dropover-active", event.target);
   $("bottom-trash").addClass("bottom-trash-active");
  },
  out: function(event) {
    $("dropover-active", event.target);
    $("bottom-trash").remove("bottom-trash-active");
  },
  update: function(event) {
    var tempArr = [];

    $(this).children().each(function() {
      var text = $(this)
      .find("p")
      .text()
      .trim();
  
    var date = $(this)
      .find("span")
      .text()
      .trim();

    tempArr.push({
      text: text,
      date: date
    });
  
    console.log(text, date);
    });

    var arrName = $(this)
      .attr("id")
      .replace("list-", "");  

    tasks[arrName] = tempArr;
      saveTasks();
  }
});

$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    ui.draggable.remove();
    console.log("drop");
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});

loadTasks();

setInterval(function() {
}, (1000 * 60) * 30);