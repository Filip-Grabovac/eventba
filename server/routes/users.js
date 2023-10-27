const express = require("express");
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
  findUsersByAccountType,
} = require("../controllers/users");

const {
  createReseller,
  getAllResellers,
  setReseller,
  removeReseller,
} = require("../controllers/resellers");
const { isAdminMiddleware } = require("../controllers/concerts");

router.route("/").get(getAllUsers).post(createUser);
router.route("/search/:search_input").post(isAdminMiddleware, searchUser);
router.route("/set_ban/:user_id/:ban_status").patch(setUserBanStatus);
router.route("/update_user_role/:id/:role").patch(updateUserRole);
router.route("/delete_user/:id").delete(deleteUser);
router.route("/get_role/:id").get(getUserRole);
router.route("/:type/:value").get(findUser);
router.route("/get_all_resellers").get(getAllResellers);
router.route("/:type").get(findUsersByAccountType);
router.route("/:id").patch(updateUser);
router.route("/verify/:verificationCode").patch(verifyUser);

// RESELLERS
router.route("/create_reseller/:id").post(createReseller);
router.route("/set_reseller/:id").patch(setReseller);
router.route("/remove_reseller_request/:id").patch(removeReseller);

module.exports = router;
