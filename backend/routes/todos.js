import express from 'express';
import { z } from 'zod';
import { todosCollection } from '../db.js'
import { ObjectId } from 'mongodb';

const router = express.Router();

const TodoSchema = z.object({
    _id: z.number(),
    task: z.string(),
    checked: z.boolean(),
  })

// let todos = [
//     { id: 1, task: 'ReactJs', checked: true },
//     { id: 2, task: 'Vite', checked: true },
//     { id: 3, task: 'NodeJS', checked: false }
//   ];

  //GET /todos
router.get('/', async (req, res) => {
    const todos = await todosCollection.find().toArray()
    res.status(200).send(todos);
});

// GET /todos/:id
router.get('/:id', async (req, res) => {
    const todoID = parseInt(req.params.id);

    if (!ObjectId.isValid(todoID)) return res.status(400).send('Invalid ID')

    const foundTodoItem = await todosCollection.findOne({ _id: todoID })
    if (foundTodoItem == null) return res.status(404).send('Not Found')

    const todoItem = await todosCollection.findOne({ _id: todoID })
  res.status(200).send(todoItem)
});

// POST /todos - { "task": "Make a wish" }
router.post('/', async (req, res) => {
  const newTodoItem = req.body;

  const parsedResult = TodoSchema.safeParse(newTodoItem);

  if (!parsedResult.success) {
    return res.status(400).send(parsedResult.error);
  }

  const result = await todosCollection.insertOne(parsedResult.data);
  const insertedId = result.insertedId; 

  const todoItem = await todosCollection.findOne({ _id: insertedId }); 
  res.status(201).send(todoItem);
});

// PATCH /todos/:id - { "checked": true }
router.patch('/:id', async (req, res) => {
  const todoID = parseInt(req.params.id);
  const checked = req.body.checked;

  if (!ObjectId.isValid(todoID)) return res.status(400).send('Invalid ID')

  const foundTodoItem = await todosCollection.findOne({ _id: todoID })
  if (foundTodoItem == null) return res.status(404).send('Not Found')

  const parsedResult = TodoSchema.safeParse({ ...foundTodoItem, checked })
  if (!parsedResult.success) return res.status(400).send(parsedResult.error)

  await todosCollection.updateOne({ _id: todoID }, { $set: { checked } })
  const todoItem = await todosCollection.findOne({ _id: todoID })
  res.status(200).send(todoItem)
});

// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  const todoID = parseInt(req.params.id);

  if (!ObjectId.isValid(todoID)) return res.status(400).send('Invalid ID')

  const foundTodoItem = await todosCollection.findOne({ _id: todoID })
  if (foundTodoItem == null) return res.status(404).send('Not Found')

  await todosCollection.deleteOne({ _id: todoID })
  res.status(204).send()
});

export default router;