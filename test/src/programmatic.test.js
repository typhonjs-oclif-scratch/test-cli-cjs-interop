import fancy               from 'fancy-test';
import { assert, expect }  from 'chai';
import oclif               from '@oclif/core';

import testcli             from '../../src/index.js';

/**
 * This tests utilize the main / programmatic export of the module.
 */
describe('Programmatic (API):', () =>
{
   it('bad command (shows how to use chai-as-promised)', async () =>
   {
      await expect(testcli('bad')).to.be.rejectedWith(oclif.Errors.CLIError, 'command bad not found');
   });

   fancy.fancy
      .stdout()
      .do(async () => await testcli('test'))
      .it('run command test', (output) =>
      {
         assert.strictEqual(output.stdout, 'ran init hook\nran test command\n');
      });
});
