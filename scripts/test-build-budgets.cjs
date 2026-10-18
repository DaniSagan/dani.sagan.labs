/* Validate the actual production budgets without touching deployment artifacts. */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { workspaces, schema, logging } = require('@angular-devkit/core');
const { NodeJsSyncHost } = require('@angular-devkit/core/node');
const { Architect } = require('@angular-devkit/architect');
const { WorkspaceNodeModulesArchitectHost } = require('@angular-devkit/architect/node');

async function main() {
  const root = path.resolve(__dirname, '..');
  const { workspace } = await workspaces.readWorkspace(
    path.join(root, 'angular.json'),
    workspaces.createWorkspaceHost(new NodeJsSyncHost()),
  );
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);
  const architect = new Architect(new WorkspaceNodeModulesArchitectHost(workspace, root), registry);
  const logger = new logging.Logger('test-build-budgets');
  logger.subscribe(entry => console.log(entry.message));
  const outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-budget-test-'));
  let run;
  try {
    console.log('Checking production budgets from angular.json (external font inlining disabled).');
    run = await architect.scheduleTarget(
      { project: 'danisagan-labs', target: 'build', configuration: 'production' },
      {
        outputPath,
        baseHref: '/dani.sagan.labs/',
        // Font downloads do not affect JS/CSS budgets and require network access.
        optimization: { scripts: true, styles: true, fonts: false },
      },
      { logger },
    );
    const result = await run.result;
    if (!result.success) {
      throw new Error('Production build or budget validation failed. See compiler errors above.');
    }
    console.log('PASS production build and budgets. Deployment output was not modified.');
  } finally {
    if (run) await run.stop();
    // Only remove the unique directory created by this invocation.
    if (path.dirname(outputPath) !== path.resolve(os.tmpdir()) ||
        !path.basename(outputPath).startsWith('danisagan-budget-test-')) {
      throw new Error(`Unexpected temporary output path: ${outputPath}`);
    }
    fs.rmSync(outputPath, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
