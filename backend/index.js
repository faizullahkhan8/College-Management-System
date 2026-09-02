const connectToMongo = require("./Database/db.js");
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 4000;
var cors = require("cors");

app.use(
    cors({
        origin: "*", //process.env.FRONTEND_API_LINK,
    }),
);

app.use(express.json()); //to convert request data to json

app.use(async (req, res, next) => {
    try {
        await connectToMongo();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello 👋 I am Working Fine 🚀");
});

app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));
app.use("/api/attendance", require("./routes/attendance.route"));
app.use("/api/fees", require("./routes/fees.route"));

// Serve receipt uploads
app.use(
    "/uploads/receipts",
    express.static(path.join(__dirname, "uploads", "receipts")),
);

const startServer = async () => {
    try {
        await connectToMongo();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;