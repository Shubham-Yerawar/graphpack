import { users } from "./db";

const isAllowed = user => {
  const { name, email } = user;

  let grantStatus = true;

  users.forEach(aUser => {
    if (aUser.name === name || aUser.email === email) {
      grantStatus = false;
    }
  });

  return grantStatus;
};

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    users: () => {
      return users;
    },
    user: (parent, { id }, context, info) => {
      const user = users.find(user => parseInt(user.id) === parseInt(id));
      return user;
    }
  },
  Mutation: {
    createUser: (parentValue, args, context, info) => {
      const { name, email, age } = args;

      const newID = users.length + 1;

      const newUser = { id: newID, name, email, age };

      if (isAllowed(newUser)) {
        users.push(newUser);
        return newUser;
      }

      throw new Error(" Duplicate fields found in name or email.");
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);

      newUser.name = name;
      newUser.email = email;
      newUser.age = age;

      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      const userIndex = users.findIndex(
        user => parseInt(user.id) === parseInt(id)
      );

      if (userIndex === -1) throw new Error("User not found.");

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    }
  }
};

export default resolvers;
