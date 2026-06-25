const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ==========================
// MySQL Connection
// ==========================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "interview"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

// ==========================
// REGISTER
// ==========================

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    const sql =
        "INSERT INTO users(name,email,password) VALUES(?,?,?)";

    db.query(sql, [name, email, password], (err) => {

        if (err) {
            console.log(err);
            res.send("Registration Failed");
        }
        else {
            res.send("Registration Successful");
        }

    });

});

// ==========================
// LOGIN
// ==========================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            res.send("Login Failed");
        }
        else if (result.length > 0) {
            res.send("Login Successful");
        }
        else {
            res.send("Invalid Email or Password");
        }

    });

});

// ==========================
// ADD QUESTION
// ==========================

app.post("/question", (req, res) => {

    const { question, answer, category } = req.body;

    const sql =
        "INSERT INTO questions(question,answer,category) VALUES(?,?,?)";

    db.query(sql, [question, answer, category], (err) => {

        if (err) {
            console.log(err);
            res.send("Question Not Added");
        }
        else {
            res.send("Question Added Successfully");
        }

    });

});

// ==========================
// VIEW QUESTIONS
// ==========================

app.get("/question", (req, res) => {

    db.query("SELECT * FROM questions", (err, result) => {

        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.json(result);
        }

    });

});

// ==========================
// SEARCH QUESTIONS
// ==========================

app.get("/search/:category", (req, res) => {

    const category = req.params.category;

    db.query(
        "SELECT * FROM questions WHERE category=?",
        [category],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.json(result);
            }

        });

});

// ==========================
// DELETE QUESTION
// ==========================

app.delete("/question/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM questions WHERE id=?",
        [id],
        (err) => {

            if (err) {
                console.log(err);
                res.send("Delete Failed");
            }
            else {
                res.send("Question Deleted Successfully");
            }

        });

});

// ==========================
// UPDATE QUESTION
// ==========================

app.put("/update/:id", (req, res) => {

    const id = req.params.id;
    const answer = req.body.answer;

    db.query(
        "UPDATE questions SET answer=? WHERE id=?",
        [answer, id],
        (err) => {

            if (err) {
                console.log(err);
                res.send("Update Failed");
            }
            else {
                res.send("Question Updated Successfully");
            }

        });

});

// ==========================
// GET TEST QUESTIONS
// ==========================

app.get("/test/:category", (req, res) => {

    const category = req.params.category;

    db.query(
        "SELECT * FROM questions WHERE category=? LIMIT 10",
        [category],
        (err, result) => {

            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.json(result);
            }

        });

});

// ==========================
// DASHBOARD
// ==========================

app.get("/dashboard", (req, res) => {

    db.query(
        "SELECT COUNT(*) AS totalQuestions FROM questions",
        (err, qResult) => {

            if (err) {
                return res.send(err);
            }

            db.query(
                "SELECT COUNT(*) AS totalUsers FROM users",
                (err, uResult) => {

                    if (err) {
                        return res.send(err);
                    }

                    db.query(
                        "SELECT COUNT(DISTINCT category) AS totalCategories FROM questions",
                        (err, cResult) => {

                            if (err) {
                                return res.send(err);
                            }

                            res.json({

                                totalQuestions: qResult[0].totalQuestions,

                                totalUsers: uResult[0].totalUsers,

                                totalCategories: cResult[0].totalCategories

                            });

                        });

                });

        });

});

// ==========================
// MOCK INTERVIEW
// ==========================

app.get("/interview", (req, res) => {

    db.query(
        "SELECT * FROM questions ORDER BY RAND() LIMIT 10",
        (err, result) => {

            if (err) {
                res.send(err);
            }
            else {
                res.json(result);
            }

        });

});

// ==========================
// SAVE RESULT
// ==========================

app.post("/result", (req, res) => {

    const { username, score } = req.body;

    db.query(
        "INSERT INTO results(username,score) VALUES(?,?)",
        [username, score],
        (err) => {

            if (err) {
                console.log(err);
                res.send("Result Not Saved");
            }
            else {
                res.send("Result Saved Successfully");
            }

        });

});

// ==========================
// VIEW RESULTS
// ==========================

app.get("/results", (req, res) => {

    db.query(
        "SELECT * FROM results ORDER BY id DESC",
        (err, result) => {

            if (err) {
                res.send(err);
            }
            else {
                res.json(result);
            }

        });

});

// ==========================
// START SERVER
// ==========================

app.listen(5000, () => {

    console.log("=====================================");
    console.log(" Smart Interview Portal Running");
    console.log(" http://localhost:5000");
    console.log("=====================================");

});