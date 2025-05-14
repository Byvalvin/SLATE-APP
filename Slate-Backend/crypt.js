const bcrypt = require('bcrypt');

// const hash = "$2b$10$6RPcEpQ8rbEeMmELpTU97.lWlPJLRXvFRXQZ1.620rEpSKCuWfohW";
const hash = "$2b$10$2WsnGLfryc7UqfoS73QgPuQY5dP5E9bDKk9nAz7PAPYzp836VXs7a";
const inputPassword = "123456";

bcrypt.compare(inputPassword, hash)
  .then(result => console.log("Password matches:", result))
  .catch(err => console.error("Error comparing:", err));
