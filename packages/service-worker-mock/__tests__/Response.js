const Response = require('../models/Response');

describe('Response', () => {
    it('should create an error Response', () => {
        const response = Response.error();
        expect(response.type).toEqual('error');
        expect(response.body).toBeNull();
        expect(response.status).toEqual(0);
    });
});