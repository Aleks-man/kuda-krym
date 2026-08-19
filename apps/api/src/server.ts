import { createApp } from "./app.js";
import { parseEnv } from "./config/env.js";

const env = parseEnv(process.env);
const app = createApp(env);

app.listen(env.PORT, () => {
  console.log(`API is running at http://localhost:${env.PORT}`);
});

