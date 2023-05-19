import { useState, useRef } from "react";
import TodoItem from "./todoItem";
import "./App.css";

export type TodoItemType = {
  id: number;
  task: string;
  checked: boolean;
};

enum TodoVisibility {
  All = "ALL",
  Active = "ACTIVE",
  Completed = "COMPLETED",
}

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [visibility, setVisibility] = useState<TodoVisibility>(
    TodoVisibility.All
  );
  const taskRef = useRef<HTMLInputElement>(null);

  const onTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const checkedTodosCount = todos.filter((t) => t.checked).length;

  let visibleTodos = todos;
  if (visibility === TodoVisibility.Active) {
    visibleTodos = todos.filter((t) => !t.checked);
  } else if (visibility === TodoVisibility.Completed) {
    visibleTodos = todos.filter((t) => t.checked);
  }

  return (
    <>
      <header>
        <h1>My Todo List</h1>
        <span>
          Complete: {checkedTodosCount}/{todos.length}
        </span>
      </header>

      <hr/>
      <div className="filtering">
        <button
          onClick={() => setVisibility(TodoVisibility.All)}
        >
          All
        </button>
        <button
          onClick={() => setVisibility(TodoVisibility.Active)}
        >
          Active
        </button>
        <button
          onClick={() => setVisibility(TodoVisibility.Completed)}
        >
          Completed
        </button>
      </div>
      <hr/>
      <br/>

      <div className="new-todo">
        <label htmlFor="name">Enter a new task:</label>
        <div className="new-todo__h">
          <input
            type="text"
            ref={taskRef}
            value={task}
            onChange={onTodoChange}
          />

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
            +
          </button>
          <button
            onClick={() => {
              setTodos([]);
            }}
            style={{ fontSize: "10px", marginLeft: "3px" }}
          >
            Clear Todos
          </button>
        </div>
      </div>

      <ul className="todos">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onCheckedChanged={(id, checked) => {
              setTodos((todos) =>
                todos.map((t) => (t.id === id ? { ...t, checked } : t))
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