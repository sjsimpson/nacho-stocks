import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createUser, getUser } from '../controllers/userController';

const jsonParser = bodyParser.json();

const router = express.Router();

router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const user = await createUser(req.body);
    res.send(user);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    console.log(`Checking for user by id: ${req.params.id}`);
    const user = await getUser(req.params.id);
    res.send(user);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default router;
