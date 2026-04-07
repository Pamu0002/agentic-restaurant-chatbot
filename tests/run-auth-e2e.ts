/**
 * TEST RUNNER - AUTHENTICATION END-TO-END
 * Run all authentication tests across frontend and backend
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTests() {
  console.log('🧪 Starting Authentication E2E Test Suite\n');
  console.log('========================================\n');

  const tests = [
    {
      name: 'Backend: Unit Tests',
      command: 'cd services/api && npm run test -- src/services/authService.test.ts',
      path: 'Backend Auth Service',
    },
    {
      name: 'Backend: Integration Tests (Routes)',
      command: 'cd services/api && npm run test -- tests/auth.routes.integration.test.ts',
      path: 'Backend Auth Routes',
    },
    {
      name: 'Backend: E2E Scenarios',
      command: 'cd services/api && npm run test -- tests/auth.e2e.test.ts',
      path: 'Backend E2E Flows',
    },
    {
      name: 'Frontend: API Integration Tests',
      command: 'cd packages/@restaurant/web && npm run test -- tests/api.integration.test.ts',
      path: 'Frontend API Calls',
    },
  ];

  const results = {
    passed: [] as string[],
    failed: [] as { name: string; error: string }[],
  };

  for (const test of tests) {
    try {
      console.log(`▶️  Running: ${test.name}`);
      console.log(`   Path: ${test.path}\n`);

      const { stdout, stderr } = await execAsync(test.command);

      if (stderr && stderr.includes('FAIL')) {
        results.failed.push({
          name: test.name,
          error: stderr,
        });
        console.log(`❌ ${test.name} FAILED\n`);
      } else {
        results.passed.push(test.name);
        console.log(`✅ ${test.name} PASSED\n`);
      }
    } catch (error: any) {
      results.failed.push({
        name: test.name,
        error: error.message || String(error),
      });
      console.log(`❌ ${test.name} FAILED`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Summary
  console.log('\n========================================\n');
  console.log('📊 TEST SUMMARY\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Total: ${tests.length}\n`);

  if (results.failed.length > 0) {
    console.log('Failed Tests:\n');
    results.failed.forEach((test) => {
      console.log(`- ${test.name}`);
      console.log(`  ${test.error.split('\n')[0]}\n`);
    });
  }

  console.log('========================================\n');

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
