import express from 'express';
import { z } from 'zod';

const router = express.Router();

const TodoSchema = z.object({
    id: z.number(),
    task: z.string(),
    checked: z.boolean(),
  })

let todos = [
    { id: 1, task: 'Spider-Man', checked: true },
    { id: 2, task: 'Iron-Man', checked: true },
    { id: 3, task: 'Dr. Strange', checked: false }
  ];

  //GET /todos
router.get('/', (req, res) => {
    res.status(200).send(todos);
});

// GET /todos/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (todo) {
        res.status(200).send(todo);
    } else {
        res.status(404).send("Todo not found");
    }
});

// POST /todos - { "task": "Make a wish" }
router.post('/', (req, res) => {
    const newTodoItem = { ...req.body, id: new Date().getTime() }

    const parsedResult = TodoSchema.safeParse(newTodoItem)
  
    if (!parsedResult.success) {
      return res.status(400).send(parsedResult.error)
    }
  
    todos = [...todos, parsedResult.data]
    res.status(201).send(parsedResult.data)
});

// PATCH /todos/:id - { "checked": true }
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const checked = req.body.checked;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex !== -1) {
      const updatedTodo = { ...todos[todoIndex], checked: checked };
      const parsedResult = TodoSchema.safeParse(updatedTodo);

      if (!parsedResult.success) {
          return res.status(400).send(parsedResult.error);
      }
    }
});

// DELETE /todos/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex !== -1) {
      const deletedTodo = todos.splice(todoIndex, 1);
      res.status(200).send(deletedTodo);
  } else {
      res.status(404).send("Todo not found");
  }
});

export default router;