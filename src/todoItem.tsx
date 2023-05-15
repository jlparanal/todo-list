import { FunctionComponent } from "react";
import { TodoItemType } from "./App";

import './App.css';

type Props = {
  todo: TodoItemType;
  onCheckedChanged(id: number, checked: boolean): void;
  onDelete?(id: number): void;
};

const TodoItem: FunctionComponent<Props> = ({
  todo,
  onCheckedChanged,
  onDelete,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className={todo.checked ? "todo--complete" : ""}>
      <span className={todo.checked ? "completed" : ""}>{todo.task}</span>
      <input
        type="checkbox"
        checked={todo.checked}
        onChange={(e) => {
          onCheckedChanged(todo.id, !todo.checked);
        }}
      />
    </div>
    <button
      className="delete-icon"
      onClick={() => {
        onDelete && onDelete(todo.id);
      }}
      style={{ backgroundColor: 'red', color: 'white' }}
    >
      x
    </button>
  </div>  
  );
};

export default TodoItem;