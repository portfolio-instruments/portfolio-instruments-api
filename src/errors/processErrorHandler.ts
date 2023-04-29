function processErrorHandlers() {
  process.on('uncaughtException', async (err: Error) => {
    console.error(err);
    process.exit(1);
  });

  process.on('unhandledRejection', async (err: Error) => {
    console.error(err);
    process.exit(1);
  });
}

export default processErrorHandlers;
