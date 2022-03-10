const { Router } = require("express");
const multer = require("multer");
const EMPLOYEE = require("../Model/Employee");
const router = Router();
const Handlebars = require("handlebars");
const { ensureAuthenticated } = require("../helper/auth_helper");
// load multer middleware
let { storage } = require("../middlewares/multer");
const upload = multer({ storage });

// =======================GET METHOD @ACCES PUBLIC====================
/*@http get method
@acces public 
@url localhost:5000/employe/home*/
router.get("/home", async (req, res) => {
  let payload = await EMPLOYEE.find({}).lean();
  res.render("../views/home", { title: "home page", payload });
});

router.get("/emp-profile", ensureAuthenticated, async (req, res) => {
  let payload = await EMPLOYEE.find({ user: req.user.id }).lean();
  res.render("../views/employees/emp-profile", { title: "home page", payload });
});
/*@http get method
@acces private 
@url localhost:5000/employe//create-emp*/
router.get("/create-emp", ensureAuthenticated, (req, res) => {
  res.render("../views/employees/create_emp");
});

/*@http get method
@acces private 
@url employee/edit emp
*/

// fetch only one profile
router.get("/:id", ensureAuthenticated, async (req, res) => {
  let payload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/empProfile", { payload });
});

router.get("/edit-emp/:id", async (req, res) => {
  let editPayload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editemp", { editPayload });
});

/*@http get method
@acces public 
@url employee/create emp
*/
router.post(
  "/create-emp",
  ensureAuthenticated,
  upload.single("emp_photo"),
  async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    // res.send("ok");

    // database
    let payload = {
      emp_photo: req.file,
      empname: req.body.empname,
      emp_id: req.body.emp_id,
      emp_salary: req.body.emp_salary,
      email: req.body.email,
      loc: req.body.loc,
      emp_education: req.body.emp_education,
      phone: req.body.phone,
      gender: req.body.gender,
      skills: req.body.skills,
      user: req.user.id,
    };
    await EMPLOYEE.create(payload);
    req.flash("SUCCESS_MESSAGE", "sucessfully created");
    res.redirect("/employee/emp-profile", 302, {});
  }
);
// =======================END ALL GET METHOD HERA======================

// ============== put request start here====================//
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE.findOne({ _id: req.params.id })
    .then(editemp => {
      // old                   new
      (editemp.emp_photo = req.file),
        (editemp.emp_id = req.body.emp_id),
        (editemp.empname = req.body.empname),
        (editemp.emp_salary = req.body.emp_salary),
        (editemp.emp_education = req.body.emp_education),
        (editemp.phone = req.body.phone),
        (editemp.email = req.body.email),
        (editemp.loc = req.body.loc),
        (editemp.gender = req.body.gender),
        (editemp.skills = req.body.skills);

      // update data in database
      editemp.save().then(_ => {
        req.flash("SUCCESS_MESSAGE", "sucessfully edited");
        res.redirect("/employee/home", 302, {});
      });
    })
    .catch(err => {
      req.flash("ERROR_MESSAGE", "something went wrong");
      console.log(err);
    });
});
// ============== put request end here====================//

// ============Delete starts here==========//
router.delete("/delete/:id", async (req, res) => {
  await EMPLOYEE.deleteOne({ _id: req.params.id });
  req.flash("ERROR_MESSAGE", "Successfully employee deleted");
  res.redirect("/employee/home", 302, {});
});
// ============Delete ends here==========//

module.exports = router;
