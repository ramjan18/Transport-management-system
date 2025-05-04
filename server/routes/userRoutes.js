const express = require("express");
const router = express.Router();

const { updateUser } = require("../controllers/user/editUser");
const { getAllUsers } = require("../controllers/user/getAllUsers");
const { getUserById } = require("../controllers/user/getUserById");
const { getUsersByRole } = require("../controllers/user/getUserByRole");
const { login } = require("../controllers/user/login");
const { signup } = require("../controllers/user/signUp");
const { deleteUser } = require("../controllers/user/deleteUser");
// const { route } = require("./purchaseOrderRoutes");

router.post('/signUp', signup);
router.post('/login' , login);
router.get('/getUseryByRole/:role' , getUsersByRole);
router.get('/getUserById/:id',getUserById);
router.get('/getAllUsers' , getAllUsers);
router.patch('/updateUser/:id' , updateUser);
router.delete("/deleteUser/:id",deleteUser);

module.exports = router;