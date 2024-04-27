// database connection for neo4j
const neo4j = require('neo4j-driver');
const user = process.env.NEO4J_USER || "neo4j"
const url = process.env.NEO4J_URI || "neo4j://localhost:7687"
// use the env variable if not found, read ./auth_key file to get the auth key,
const password = process.env.NEO4J_PASSWORD || require('fs').readFileSync('./auth_key', 'utf8').trim()
const driver = neo4j.driver(url, neo4j.auth.basic(user, password))
const dbSession = driver.session({
  database: "neo4j",
  defaultAccessMode: neo4j.session.WRITE
})

export default dbSession;