import { afterAll } from "bun:test";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

// Before run test , setup script creates a container with a test DB to run the test in a isolated way
// When you run the tests multiple times and it is stuck "Starting container" is because the previous container is not finished. You have to run ir again an works fine. TODO fix
  let environment;
  console.log("Starting container")
  environment = await new PostgreSqlContainer("postgres:15").withDatabase("mydatabase").withUsername("myuser").withExposedPorts(5432).start();
  console.log(environment.getHost())
  console.log(environment.getConnectionUri())
  //Set uri connection to run the test
  process.env.DATABASE_URL = environment.getConnectionUri()

  //Stop container when test are finished
  afterAll(async () => {
    console.log("Finishing container")
    await environment.stop();
  });