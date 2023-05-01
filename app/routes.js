module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    const workouts = [
      {
        name: "Cardio Blast",
        description:
          "A high-intensity cardio workout that will get your heart pumping and calories burning!",
        difficulty: "Intermediate",
        duration: "45 minutes",
        equipment: ["Treadmill", "Stationary bike", "Elliptical"],
      },
      {
        name: "Total Body Toning",
        description:
          "This full-body workout will tone and sculpt every muscle group for a lean and defined physique.",
        difficulty: "Advanced",
        duration: "60 minutes",
        equipment: ["Dumbbells", "Resistance bands", "Kettlebells"],
      },
      {
        name: "Yoga Flow",
        description:
          "A calming and rejuvenating yoga practice that will stretch and strengthen your body and mind.",
        difficulty: "Beginner",
        duration: "30 minutes",
        equipment: ["Yoga mat", "Yoga blocks", "Yoga strap"],
      },
      {
        name: "HIIT Bootcamp",
        description:
          "This high-intensity interval training workout will challenge your stamina, speed, and agility.",
        difficulty: "Advanced",
        duration: "60 minutes",
        equipment: ["Jump rope", "Kettlebells", "Boxing gloves"],
      },
      {
        name: "Pilates Sculpt",
        description:
          "This low-impact workout focuses on core strength, flexibility, and body alignment.",
        difficulty: "Intermediate",
        duration: "45 minutes",
        equipment: ["Pilates reformer", "Pilates ball", "Resistance bands"],
      },
      {
        name: "Powerlifting 101",
        description:
          'This strength-building workout focuses on the "big three" lifts: squat, bench press, and deadlift.',
        difficulty: "Advanced",
        duration: "90 minutes",
        equipment: ["Barbell", "Weight plates", "Power rack"],
      },
      {
        name: "Zumba Dance Party",
        description:
          "This high-energy dance workout features Latin-inspired music and moves for a fun and effective cardio workout.",
        difficulty: "Beginner",
        duration: "60 minutes",
        equipment: ["None"],
      },
      {
        name: "Bodyweight Burn",
        description:
          "This equipment-free workout uses your own body weight for resistance and cardio training.",
        difficulty: "Intermediate",
        duration: "30 minutes",
        equipment: ["None"],
      },
      {
        name: "Boxing Bootcamp",
        description:
          "This intense workout combines boxing drills with strength exercises for a total-body challenge.",
        difficulty: "Advanced",
        duration: "60 minutes",
        equipment: ["Boxing gloves", "Heavy bag", "Speed bag"],
      },
      {
        name: "Barre Fitness",
        description:
          "This low-impact workout combines ballet-inspired moves with Pilates and yoga for a full-body workout.",
        difficulty: "Intermediate",
        duration: "45 minutes",
        equipment: ["Barre", "Resistance bands", "Pilates ball"],
      },
    ];

    db.collection("workouts")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          saved: result,
          workouts,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/save", (req, res) => {
    console.log(req.body, "saving");
    db.collection("workouts").save(
      {
        name: req.body.name,
        description: req.body.description,
        difficulty: req.body.difficulty,
        duration: req.body.duration,
        equipment: req.body.equipment,
      },
      (err, result) => {
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/messages", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/clearAll", (req, res) => {
    db.collection("workouts").deleteMany({}, (err, result) => {
      if (err) return res.send(500, err);
    });
  });

  // app.delete('/messages', (req, res) => {
  //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
