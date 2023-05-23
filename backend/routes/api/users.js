// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...



// backend/routes/api/users.js
// ...
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email.'),

    check('username')
      .exists({ checkFalsy: true })
      // .withMessage('Username is required')
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),

    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),

    check('password')
      .exists({ checkFalsy: true })
      // .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),

    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),

    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),


    handleValidationErrors
  ];


// backend/routes/api/users.js
// ...

// Sign up
router.post(
    '', validateSignup,
    async (req, res) => {

      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      // res.json(req.body)

      const findUser = await User.findAll()
      // res.json(findUser)


      for(let i=0; i<findUser.length; i++){
        if(findUser[i].username === username){
          return res.status(403).json({message:"User already exists", statusCode:403, errors:["User with that username already exists"]})
        }
        if(findUser[i].email === email){
          console.log('UUUUUUUUUUUUUUUUUUUUUU')
          return res.status(403).json({message:"User already exists", statusCode:403, errors:["User with that email already exists"]})
        }
      }


      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName:user.lastName,
        email: user.email,
        username: user.username,
      };

      let first = await setTokenCookie(res, safeUser);
      safeUser.token = first

      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
