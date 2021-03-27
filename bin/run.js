#!/usr/bin/env node
import url   from 'url';
import flush from '@oclif/core/flush.js';
import oclif from '@oclif/core';

oclif.run(void 0, url.fileURLToPath(import.meta.url))
.then(flush)
.catch(oclif.Errors.handle);
