logging middleware

this is a reusable logging package built in typescript for the campus hiring evaluation. it exports a logger class that sends logs to the server.

how to use:
first add it to your project using "logging-middleware": "file:../logging_middleware" in your package.json

then import it and initialize it:
import { Logger } from "logging-middleware";

const logger = new Logger({
  email: "student@example",
  name: "Student",
  rollNo: "XXXX",
  accessCode: "XXXX",
  clientID: "XXXX",
  clientSecret: "XXXX"
});

then you can just call it like this:
logger.Log("frontend", "info", "api", "fetching data");


api output screenshots:

1. Auth API
![alt text](<output screenshots/auth.png>)
2. Logs API
![alt text](<output screenshots/log.png>)
