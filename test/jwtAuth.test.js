const jwt = require('jsonwebtoken');

const {validateJwt} = require('../src/jwtAuth');

jest.mock('jsonwebtoken');

describe('jwtAuth', () => {
    let req, res, next;

    describe('validateJwt', () => {
        describe('when no auth header', () => {
            beforeEach(() => {
                req = {
                    header: jest.fn(),
                };

                res = {
                    sendStatus: jest.fn(),
                    status: jest.fn()
                };

                next = jest.fn();
            });

            it('should send status of 403', () => {
                validateJwt(req, res, next);

                expect(res.sendStatus).toHaveBeenCalledTimes(1);
                expect(res.sendStatus).toHaveBeenCalledWith(403);
            });
        });

        describe('when auth header', () => {
            beforeEach(() => {
                token = 'blahblahblah';
                authHeader = `Bearer ${token}`;
                reqHeader = jest.fn().mockReturnValue(authHeader);
                req = {
                    header: jest.fn(),
                };

                res = {
                    sendStatus: jest.fn(),
                    status: jest.fn()
                };

                next = jest.fn();
            });

            it('should call next', () => {

            });
        });
    });
});
