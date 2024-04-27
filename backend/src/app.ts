import express, { Application, Request, Response, NextFunction } from "express";
import dbSession from "./db";
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await dbSession.run(
        "MATCH (n) WHERE NOT (:Node)<-[:CHILD_OF]-(n) " +
            "MATCH path = (n)-[:CHILD_OF*]-(:Node) " +
            "WITH collect(path) as paths " +
            "CALL apoc.convert.toTree(paths) yield value " +
            "RETURN value;"
        );
        const trees = result.records.map(
        (record: { _fields: Object[] }) => record._fields[0]
        );
        res.json(trees);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});