const db = require("../models/index")

const getUsers = async (req, res) => {
  const users = await db.User.findAll({
    include: {
      model: db.Channel,
      as: 'channel'
    }
  })
  res.status(201).json(users)
}

const createUser = async (req, res) => {
  const user = req.body
  const userCreated = await db.User.create({
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
  res.status(201).json(userCreated)
}

module.exports = {
  getUsers,
  createUser
}
