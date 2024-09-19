const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator=require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})


userSchema.statics.signup = async function(email, password) {

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }
  const salt = await bcrypt.genSalt(7)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash })

  return user
}


userSchema.statics.login = async function(email, password)
{
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const exists = await this.findOne({ email })

  if (!exists) {
    throw Error('Email not found, Please Signup')
  }

  const match=await bcrypt.compare(password,exists.password)

  if(!match)
  {
    throw Error('Password doesnot match')
  }

  return exists
}

module.exports = mongoose.model('User', userSchema)