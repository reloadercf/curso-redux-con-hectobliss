//import * as Redux from 'redux'
import {createStore,combineReducers} from 'redux'
import { inherits } from 'util';

//nodes
let input= document.getElementById('input');
let lista= document.getElementById('lista');
let addEmail=document.getElementById("addEmail")
let emailList=document.getElementById("emailList")
let todos={
    0:{
        text:"Ir al cine",
        done: false
    },
    1:{
        text:"Cenar",
        done: true
    },
    2:{
        text:"Grabar",
        done: false
    }
};
//function


function drawEmails() {
    emailList.innerHTML = ""
    let emails = store.getState().emails
    emails.map(email => {
      let li = document.createElement('li')
      li.innerHTML = `
        <span>${email}</span>
        <span id="${email}" >X</span>
      `
      setEmailClickListener(li)
      emailList.appendChild(li)
    })
  
  }

  function setEmailClickListener(li){
      li.addEventListener("click", e=>{
          let email=e.target.id
          store.dispatch({
              type:"DELETE_EMAIL",
              email
          })
      })
  }

function drawTodos(){
    lista.innerHTML='';
    //actualizar lod todos antes de dibujar
    todos= store.getState();

    //
    for(let key in todos){
        let li=document.createElement('li')
        // li.id=key
        let classDone=todos[key].done ? "done":""
        li.innerHTML=`
        <span id="${key}" class="${classDone}">${todos[key].text}</span>
        <span data-id=${key} data-action="delete" >X</span>
        `
        setLiseners(li);
        lista.appendChild(li)
    }
}

function setLiseners(li){
    li.addEventListener('click', e=>{
        console.log(e.target);
        if(e.target.getAttribute("data-action")==="delete"){
            let key=e.target.getAttribute("data-id")
            delete todos[key]
            // drawTodos();
            store.dispatch({
                type:"DELETE_TODO",
                id:key
            });
            return;
        }
        let key=e.target.id;
        // todos[key].done = !todos[key].done;
        // drawTodos();
        todos[key].done=!todos[key].done
        store.dispatch({
            type:"UPDATE_TODO",
            todo:todos[key]
        })
    })
}
//listeners
input.addEventListener('keydown',e=>{
    if(e.key==="Enter"){
        let text = e.target.value;
        let todo={text, done:false}
        store.dispatch({
            type:"ADD_TODO",
            todo
        })
        //let id=Object.keys(todos).length
        //todos[id]={text, done:false};
        //drawTodos();
    }
});
addEmail.addEventListener('keydown', e => {
    if (e.key === "Enter") {
      let email = e.target.value
      e.target.value = ""
      store.dispatch({
        type: "ADD_EMAIL",
        email
      })
    }
  })


//Redux
function emailsReducer(state = [], action) {
    switch (action.type) {
      case "ADD_EMAIL":
        return [action.email, ...state]
      case "DELETE_EMAIL":
        return [...state.filter(mail => mail !== action.email)]
      default:
        return state
    }
  }

//reducer
function todosReducer(state={}, action){
    switch(action.type){
        case "ADD_TODO":
        action.todo['id']=Object.keys(state).length
            return {...state, [Object.keys(state).length]:action.todo}
        case "UPDATE_TODO":
            return {...state, [action.todo.id]:action.todo}
        case "DELETE_TODO":
            delete state[action.id]
            return {...state};
        default:
            return state
    }
}

//combinar los reducers
let rootReducer=combineReducers({
    todos: todosReducer,
    email: emailsReducer
})

//store
let store = createStore(rootReducer, {
    emails: ["elcfm1@gmail.com"],
    todos: {
      0: {
        text: "crear store",
        done: true,
        id: 0
      }
    }
  });

//sustituir los todos
// todos=store.getState();

//que hacer cuando hay cambios?
store.subscribe(() => {
    drawTodos()
    drawEmails()
  })
  
  //init
  drawTodos();
  drawEmails();