import oclif   from '@oclif/core';

/**
 * Invokes the `testcli-interop` CLI with args programmatically.
 *
 * @param {...string} args - args to pass to CLI.
 *
 * @returns {Promise<void>}
 */
export default async function testcli(...args)
{
   return oclif.run(args, import.meta.url);
}
