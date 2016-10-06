module.exports = {
  jwt_cert: 'SOME_JWT_CERT',
  smtp: {
    host: 'smtp.example.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'username@example.com',
      pass: 'password'
    }
  },
  email: {
    sender: '"八度导航" <username@example.com>',
    receiver: 'receiver@example.com'
  }
};