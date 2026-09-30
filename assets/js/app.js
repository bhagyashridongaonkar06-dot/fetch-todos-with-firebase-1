const cl = console.log;


const todoform = document.getElementById('todoform')
const todoList = document.getElementById('todoList')
const addTodo = document.getElementById('addTodo')
const updateTodo = document.getElementById('updateTodo')
const spinner = document.getElementById('spinner')

const base_url = 'https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/'
const todo_url = `${base_url}/todos.json`

let statmng = {
    todoArr: [],
    editId: null

}

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function spinnerHandle(flag) {
    if (flag) {
        spinner.classList.remove('d-none')
    } else {
        spinner.classList.add('d-none')
    }
}

//read functionality

function onRead() {
    spinnerHandle(true)
    fetch(todo_url, {
        method: "GET",
        body: null,
        header: {
            "content-type": "application/json",
            "autho": "JWT token from LS"
        }
    })

        .then(res => {
            if (!res.ok) {
                throw new Error("Https : error")
            }
            return res.json()
        })
        .then(data => {
            // cl(data)

            for (const key in data) {
                data[key].id = key
                //    cl(data[key])

                statmng.todoArr.push(data[key])
                // cl(statmng.todoArr)
            }
            renderTodo(statmng.todoArr)
        })
        .catch(err => {
            snackbar('error which fetching the data')
        })
        .finally(()=>{
            spinnerHandle()
        })
}

onRead()

//templating

function renderTodo(arr) {
    let res = '';

    arr.forEach(ele => {
        res += `<li class="list-group-item d-flex justify-content-between align-items-center" id="${ele.id}">
                                <span>${ele.todo}</span>

                                <div>
                                    <i role="button"  onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                                    <i role="button"  onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>
                            </li>`
    });
    todoList.innerHTML = res
}


//create functionality

function onCreate(eve) {
    eve.preventDefault();
    spinnerHandle(true)

    let newTodo = {
        todo: todo.value
    }

    
    fetch(todo_url, {
        method: "POST",
        body: JSON.stringify(newTodo),
        header: {
            "content-type": "application/json",
            "autho": "JWT token from LS"
        }
    })
    
    .then(res => {
        if (!res.ok) {
            throw new Error('Http : error')
        }
        return res.json()
    })
    .then(data => {
        todoform.reset()
        statmng.todoArr.push(newTodo)
        newTodo.id = data.name
            let li = document.createElement('li')
            li.id = data.name
            li.className = 'list-group-item d-flex justify-content-between align-items-center'
            li.innerHTML = `<span>${newTodo.todo}</span>

                                <div>
                                    <i role="button"  onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                                    <i role="button"  onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>`
            todoList.append(li)
        })
        .catch(err => {
            snackbar('something went wrong whike creating new todo', 'error')
        })
        .finally(()=>{
            spinnerHandle()
        })
}

//Edit Functionality

function onEdit(ele) {
    spinnerHandle(true)
    let editId = ele.closest('li').id;
    // cl(editId)

    statmng.editId = editId

    let edit_url = `${base_url}/todos/${editId}.json`

    fetch(edit_url, {
        method: "GET",
        body: null,
        header: {
            "content-type": "application/json",
            "autho": "JWT token from LS"
        }
    })

        .then(res => {
            if (!res.ok) {
                throw new Error('Http : error')
            }
            return res.json()
        })
        .then(data => {
            todo.value = data.todo

            addTodo.classList.add('d-none')
            updateTodo.classList.remove('d-none')
        })
        .catch(err => {
            snackbar('something went wrong while patching the data', 'error')
        })
        .finally(()=>{
            spinnerHandle()
        })
}

//update Functionality

function onUpdate() {
    spinnerHandle(true)
    let updateId = statmng.editId;
    // cl(updateId)

    let update_url = `${base_url}/todos/${updateId}.json`
    // cl(update_url)

    let updateObj = {
        todo: todo.value,
        id: updateId
    }

    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(updateObj),
        header: {
            "content-type": "application/json",
            "autho": "JWT token from LS"
        }
    })

        .then(res => {
            if (!res.ok) {
                throw new Error('Http : error')
            }
            return res.json()
        })
        .then(data => {
            todoform.reset()
            let index = statmng.todoArr.findIndex(e => e.id === updateId)
            statmng.todoArr[index] = updateObj

            let li = document.getElementById(updateId)
            li.id = data.name
            li.innerHTML = `<span>${data.todo}</span>

                                <div>
                                    <i role="button"  onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-success"></i>
                                    <i role="button"  onclick="onDelete(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>`
            addTodo.classList.remove('d-none')
            updateTodo.classList.add('d-none')
            snackbar('todo updated successfully', 'success')
        })
        .catch(err => {
            snackbar('unable to update the todo', 'error')
        })
        .finally(()=>{
            spinnerHandle()
        })
}

// Delete funtionality

function onDelete(ele) {
    let deleteId = ele.closest('li').id
    // cl(deleteId)

    let delete_url = `${base_url}/todos/${deleteId}.json`


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
    }).then((result) => {
        if (result.isConfirmed) {
            spinnerHandle(true)
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                header: {
                    "content-type": "application/json",
                    "autho": "JWT token from LS"
                }
            })

            .then(res => {
                if(!res.ok){
                    throw new Error('Http : error')
                }
                return res.json()
            })
            .then(data =>{
                let index= statmng.todoArr.findIndex(e => e.id === deleteId)
                // cl(index)
                statmng.todoArr.splice(index, 1)

                ele.closest('li').remove()

                snackbar(`todo with id ${deleteId} deleted successfully `, 'success')
            })
            .catch(err =>{
                snackbar('error while deleteing todo', 'error')
            })
            .finally(()=>{
                spinnerHandle()
            })
        }
    });

}



todoform.addEventListener('submit', onCreate)
updateTodo.addEventListener('click', onUpdate)


// cl(statmng.todoArr)