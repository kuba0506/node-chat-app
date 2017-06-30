var expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
    let expected;
    let actual;

    it('should reject non-string values', () => {
        //Assemble
        expected = {
            name: '',
            room: 213
        };
        //Act
        actual = isRealString(expected.name);
        //Assert
        expect(actual).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        //Assemble
        expected = {
            name: '',
            room: '    '
        };
        //Act
        actual = isRealString(expected.room);
        //Assert
        expect(actual).toBeFalsy();
    });

    it('should allow string witn non-space characters', () => {
        //Assemble
        expected = {
            name: ' test ',
            room: ' '
        };
        //Act
        actual = isRealString(expected.name);
        //Assert
        expect(actual).toBeTruthy();
    });
});