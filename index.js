const { ApolloServer } = require("apollo-server");
const { postgraphile } = require("postgraphile");
const { weaveSchemas } = require("graphql-weaver");
const http = require("http");

async function main() {
  const server1 = http
    .createServer(postgraphile("pggql_test", "a"))
    .listen(9501);
  const server2 = http
    .createServer(postgraphile("pggql_test", "b"))
    .listen(9502);

  const schema = await weaveSchemas({
    endpoints: [
      {
        namespace: "a",
        typePrefix: "A",
        url: "http://localhost:9501/graphql"
      },
      {
        namespace: "b",
        typePrefix: "B",
        url: "http://localhost:9502/graphql"
      }
    ]
  });

  const server = new ApolloServer({
    schema
  });
  const url = await server.listen(9500);
  console.log(url);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
