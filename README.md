# TreeNode hierarchy visualization

## Description
This is a simple web application to visualize tree hierarchy with graph database.
- frontend: vue.js
- backend: express.js
- database: neo4j

## Run code locally

### 0. clone the repository
```bash
git clone
```

### 1. neo4j installation
```bash
docker run \
    -p 7474:7474 -p 7687:7687 \
    --name neo4j \
    -v ./neo4j/data:/data \
    -v ./neo4j/logs:/logs \
    -v ./neo4j/import:/var/lib/neo4j/import \
    -v ./neo4j/plugins:/plugins \
    -e NEO4J_AUTH=neo4j/neo4j_test123 \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4JLABS_PLUGINS=\[\"apoc\"\] \
    -d \
    neo4j
```

### 2. backend
```bash
cd backend
npm install
npm run migrate
npm start
```

### 3. frontend
```bash
cd frontend
npm install
export VUE_APP_URL=http://localhost:3000/api
npm run serve
```

### 4. open browser
open http://localhost:8080/


## Run with docker-compose

```bash
git clone
docker-compose build
docker-compose up -d
docker-compose exec backend npm run migrate
```
open browser with http://localhost:80

