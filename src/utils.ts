import fs from 'fs'

export const getRsaPrivateKey = () => {
  return fs.readFileSync('./rsa/private.rsa', 'utf-8')
}

export const getRsaPublicKey = () => {
  return fs.readFileSync('./rsa/public.pem', 'utf-8')
}
