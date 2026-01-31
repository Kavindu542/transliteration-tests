import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTests() {
  try {
    const { stdout, stderr } = await execAsync('npx playwright test');
    process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);

    await execAsync('npx playwright show-report');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
