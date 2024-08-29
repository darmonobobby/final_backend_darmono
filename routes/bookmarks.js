const { create, index } = require("../controllers/bookmarks.controller");

const router = require("express").Router();

router.post("/bookmark/:id", create);
router.get("/mybookmark", index);

module.exports = router;