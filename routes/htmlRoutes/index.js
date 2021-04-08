const path = require("path");
const router = require("express").Router();

// "/" brings to root route of server, used to create homepage
// index.html file itself never gets to browser, only contents
router.get("/", (req, res) => {
  // use res.sendFile() instead of res.json()
  // bc this GET route only has to display HTML page
  // use path module to ensure we're finding the correct location for HTML
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// simple endpoint route (no "/api") suggests this serves HTML page
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

// wildcard route, will receive homepage as res
// this should always come as last route
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;