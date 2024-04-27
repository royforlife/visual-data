// database connection for neo4j
const neo4j = require('neo4j-driver');
const user = process.env.NEO4J_USER || "neo4j"
const url = process.env.NEO4J_URI || "bolt://localhost:7687"
// read ./auth_key file to get the auth key, if not found, use the env variable
const password = process.env.NEO4J_PASSWORD || require('fs').readFileSync('./auth_key', 'utf8').trim()
const driver = neo4j.driver(url, neo4j.auth.basic(user, password))
const dbSession = driver.session({
  database: "neo4j",
  defaultAccessMode: neo4j.session.WRITE
})
const datafile = require("./data.json");
const data = datafile.data;

const migrate = async () => {
    try {
        // query databased to check if the data is already present
        const res = await dbSession.run("MATCH (n) RETURN n.name as name");
        if (res.records.length > 0) {
            console.log("Data already present in the database");
            return;
        }
        // create the data in the database
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            await dbSession.run(
                "CREATE (n:Node {name: $name, description: $description})",
                {
                    name: node.name,
                    description: node.description
                }
            );
            if (node.parent) {
                await dbSession.run(
                    "MATCH (n:Node {name: $name}), (p:Node {name: $parent}) CREATE (n)-[:CHILD_OF]->(p)",
                    {
                        name: node.name,
                        parent: node.parent
                    }
                );
            }
        }

    } catch (error) {
        console.log(error);
    } finally {
        dbSession.close();
        driver.close();
    }
}

migrate();