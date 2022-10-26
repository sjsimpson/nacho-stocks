import { IUser, User } from "./models/user"


const users = [
  {
    username: 'spencerjsimpson',
    password: 'testing',
  },
  {
    username: 'keltson',
    password: 'mtg'
  }
]

export const addUser = async (user: IUser) => {
  const newUser = new User(user);
  const createdUser = await newUser.save();
  return createdUser;
}

export const getUser = async (username: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ username, password });

  if (!user) throw Error("User not found.")
  return user;
}
