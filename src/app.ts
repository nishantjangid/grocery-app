import ENV_VARIABLES from "./config/env.config";
import { app } from ".";

// INITIATE APP
app.listen(ENV_VARIABLES.PORT, () => {
  return console.log(`Server is running at ${ENV_VARIABLES.PORT}`);
});
