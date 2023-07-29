const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  findUser,
  updateUser,
  verifyUser,
  searchUser,
  setUserBanStatus,
  updateUserRole,
  deleteUser,
  getUserRole,
} = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser);
router.route('/search/:search_input').get(searchUser);
router.route('/set_ban/:user_id/:ban_status').patch(setUserBanStatus);
router.route('/update_user_role/:id/:role').patch(updateUserRole);
router.route('/delete_user/:id').delete(deleteUser);
router.route('/get_role/:id').get(getUserRole);
router.route('/:type/:value').get(findUser);
router.route('/:id').patch(updateUser);
router.route('/verify/:verificationCode').patch(verifyUser);

module.exports = router;
