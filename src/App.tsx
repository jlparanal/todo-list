import { useState, useRef } from "react";
import TodoItem from "./todoItem";
import './App.css'

export type TodoItemType = {
  id: number;
  task: string;
  checked: boolean;
};

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const taskRef = useRef<HTMLInputElement>(null);

  const onTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const checkedTodosCount = todos.filter((t) => t.checked).length;

  return (
    <>

        <h1>My Todo List</h1>
   

      <div className="new-todo">
          <label htmlFor="name">Enter a new task:</label>
          <div className="new-todo__h">
          <input type="text" ref={taskRef} value={task} onChange={onTodoChange} />
    
        <button
        onClick={() => {
          setTodos((todos) => [
            ...todos,
            { id: new Date().getTime(), task, checked: false },
          ]);
          setTask("");
          taskRef.current?.focus();
        }}
      >
        ADD
      </button>
      <button
        onClick={() => {
          setTodos([]);
        }}
      style={{fontSize:"15px", marginLeft:"3px"}}>
        Clear Todos
      </button>
      <span>
          Complete: {checkedTodosCount}/{todos.length}
        </span>
      </div>
      </div>

      <ul className="todos">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onCheckedChanged={(id, checked) => {
              setTodos((todos) =>
                todos.map((t) =>
                  t.id === id ? { ...t, checked } : t
                )
              );
            }}
            onDelete={(id) => {
              setTodos((todos) => todos.filter((t) => t.id !== id));
            }}
          />
      ))}
    </ul>
    </>
  );
}

export default App;