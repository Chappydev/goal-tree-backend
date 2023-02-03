const app = require("./app");
const config = require("./utility/config");
const logger = require("./utility/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
