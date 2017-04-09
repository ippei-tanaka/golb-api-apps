import {expect} from 'chai';

const urlResolver = require("../../src/utilities/url-resolver");

describe('urlResolver', () =>
{
    describe('resolve', () =>
    {
        it('should resolve a path', () =>
        {
            expect(urlResolver.resolve('testDir', 'test.js')).to.equal('testDir/test.js');
            expect(urlResolver.resolve('testDir1', 'testDir2', 'testDir3/test.js')).to.equal('testDir1/testDir2/testDir3/test.js');
        });

        it('should trim white space around a path', () =>
        {
            expect(urlResolver.resolve('  testDir1 ', ' testDir2', ' test.js  ')).to.equal('testDir1/testDir2/test.js');
            expect(urlResolver.resolve('  t estDir1 ', ' testDi r2', ' test.js  ')).to.equal('t estDir1/testDi r2/test.js');
        });

        it('should keep an absolute path absolute', () =>
        {
            expect(urlResolver.resolve('/testDir1 ', 'testDir2', 'test.js')).to.equal('/testDir1/testDir2/test.js');
        });
    });
});