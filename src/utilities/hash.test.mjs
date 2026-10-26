import {createHash} from "./hash.mjs";


describe('createHash function', () => {

    it('should generate a SHA256 hash as output', () => {
        expect(createHash('ella')).toEqual('fb2cb45b6b443241e38145b6445a6e0ebee0410d19e71d9fd0adf5fc382d49e5');

    })
})