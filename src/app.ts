import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

const members: any = {};

const pointsMember = (studentId: string) => {
  if (!members[studentId]) {
    members[studentId] = { studentId, totalPoints: 1000 };
  }
};

app.get("/spu/points", (req, res) => {
  res.send("Welcome to SPU Member Points API [ CSI402-BackEnd_API ]");
});

app.post("/spu/points/add", (req, res) => {
  const { studentId, amount } = req.body;

  if (!studentId || typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Invalid input data" });
  }

  pointsMember(studentId);

  const earnedPoints = Math.floor(amount / 100) * 10;
  members[studentId].totalPoints += earnedPoints;

  res.json({
    studentId,
    earnedPoints,
    totalPoints: members[studentId].totalPoints,
  });
});

app.get("/spu/points/:studentId", (req, res) => {
  const { studentId } = req.params;

  pointsMember(studentId);

  res.json({
    studentId,
    totalPoints: members[studentId].totalPoints,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
