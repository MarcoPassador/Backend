import bCrypt from 'bcryptjs';

export const createHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

export const isValidPassword = (userPassword, password) => {
  return bCrypt.compareSync(password, userPassword)
}