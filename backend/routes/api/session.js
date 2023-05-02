// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const validateLogin = [
    // check('credential')
    //   .exists({ checkFalsy: true })
    //   .notEmpty()
    //   .withMessage('Please provide a valid email or username.'),

    // check('password')
    //   .exists({ checkFalsy: true })
    //   .withMessage('Please provide a password.'),

    //   check('credential','password')
    //   .exists({ checkFalsy: true })
    //   .withMessage('Email or username is required, Password is required'),

      check('credential').custom((value, { req }) => {
        if(!req.body.credential && !req.body.password) {
            throw new Error ('Email or username is required, Password is required');
            // err.title = 'Authentication required';
            // err.message = 'Authentication required';
            // err.errors = { message: 'Authentication required' , status:401};
            // err.status = 401;
            // // err.stack = 'delete'
            // err.stack=null
            // delete err.stack
            // throw err
        }
        else if(!req.body.credential && req.body.password) {
          throw new Error ('Please provide a valid email or username.');
          // // res.status(400).json({message:'Validation Error',errors:['Please provide a valid email or username.'], status:400})
          // err.title = 'Authentication required';
          // err.message = 'Authentication required';
          // err.errors = { message: 'Authentication required' , status:401};
          // err.status = 401;
          // // err.stack = 'delete'
          // err.stack=null
          // delete err.stack
          // throw err

      }
      else if(req.body.credential && !req.body.password) {
        throw new Error ('Please provide a password.');
        // err.title = 'Authentication required';
        // err.message = 'Authentication required';
        // err.errors = { message: 'Authentication required' , status:401};
        // err.status = 401;
        // // err.stack = 'delete'
        // err.stack=null
        // delete err.stack
        // throw err
    }
        return true   }),


    //     const err = new Error('Authentication required');
    // err.title = 'Authentication required';
    // err.message = 'Authentication required';
    // err.errors = { message: 'Authentication required' , status:401};
    // err.status = 401;
    // // err.stack = 'delete'
    // err.stack=null
    // delete err.stack
    // // console.log(err.stack, 'hereeeeeeeee')
    // // Error.captureStackTrace(err, requireAuth)
    // return next(err);


    handleValidationErrors
  ];

// backend/routes/api/session.js
// ...


// Log in
router.post('/',validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {

        // const err = new Error('Login failed');
        // err.status = 401;
        // err.title = 'Login failed';
        // err.errors = {message: 'Invalid credentials' ,status:401};

        // delete err.stack
        // return next(err);

        res.status(401).json({message:'Invalid credentials', status:401})
        return
      }


      const safeUser = {
        id: user.id,
        firstName:user.firstName,
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

  // backend/routes/api/session.js
// ...

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  // backend/routes/api/session.js
// ...

// Restore session user
router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

  // ...

  // backend/routes/api/session.js
// ...

// Log in
// router.post(
//     '/',
//     validateLogin,
//     async (req, res, next) => {
//       const { credential, password } = req.body;

//       const user = await User.unscoped().findOne({
//         where: {
//           [Op.or]: {
//             username: credential,
//             email: credential
//           }
//         }
//       });

//       if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
//         const err = new Error('Login failed');
//         // err.status = 401;
//         // err.title = 'Login failed';
//         // err.errors = { credential: 'The provided credentials were invalid.' };
//         // delete err.stack
//         // delete err.message
//         // delete err.errors
//         return next(err);
//       }

//       const safeUser = {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//       };

//       await setTokenCookie(res, safeUser);

//       return res.json({
//         user: safeUser
//       });
//     }
//   );


module.exports = router;
