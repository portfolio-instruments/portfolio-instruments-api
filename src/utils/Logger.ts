import chalk from 'chalk';

/*
 * Chalk 5 has changed to ESM.  If we want to use Chalk with TypeScript,
 * we need to probably use Chalk 4 for now.
 */

export default class Logger {
  public static log = (args: unknown) => this.info(args);

  public static info(args: unknown) {
    console.log(
      // prettier-ignore
      chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.blueBright(args) : args
    );
  }

  public static warn(args: unknown) {
    console.log(
      // prettier-ignore
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.yellowBright(args) : args
    );
  }

  public static error(args: unknown) {
    console.log(
      // prettier-ignore
      chalk.red(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.redBright(args) : args
    );
  }
}
