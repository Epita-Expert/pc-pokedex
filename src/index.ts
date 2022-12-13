import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import users from "./routes/users";
// import oauth from "./routes/oauth";
// import auth from "./routes/auth";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";
import prisma from "./client/prisma.client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("*", (req: Request, res: Response, next: any) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// app.use("/oauth", oauth);
// app.use("/auth", auth)
// app.use("/users", users);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", (req: Request, res: Response) => {
  res.status(404).send("404 - Not Found");
});

app.listen(port || 3001, async () => {
  try {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${port || 3001}`
    );
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
});
