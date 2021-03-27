import spawn      from 'cross-spawn';

import stringio   from '@rauschma/stringio';

import { assert } from 'chai';

describe('Spawn Test CLI', () =>
{
   it('run local CLI - command test', async () =>
   {
      let data = '';
      const cli = spawn('./bin/run.js', ['test']);
      cli.stdout.on('data', (chunk) => { data += chunk; });

      await stringio.onExit(cli);

      assert(data, 'ran init hook\nran test command');
   });

   it('run NPM CLI - command test', async () =>
   {
      let data = '';
      const cli = spawn('npm', ['run', 'run-npm-cli', 'test'], { shell: true });
      cli.stdout.on('data', (chunk) => { data += chunk; });

      await stringio.onExit(cli);

      assert(data, 'ran init hook\nran test command');
   });

   // Only run in CI when testcli-exp is installed globally.
   if (process.env.CI)
   {
      it('run global CLI - command test', async () =>
      {
         let data = '';
         const cli = spawn('testcli-interop', ['test'], { shell: true });
         cli.stdout.on('data', (chunk) => { data += chunk; });

         await stringio.onExit(cli);

         assert(data, 'ran init hook\nran test command');
      });
   }
});
