var expect = require('expect');

var { messageGenerator, locationMessageGenerator } = require('./message');

describe('messageGenerator()', () => {
    var actual, expected;

    it('should generate correct message object', () => {
        //Assemble
        expected = {
            from: 'Kuba',
            text: 'lorem ipsum',
            createdAt: +new Date()
        };
        //Act
        actual = messageGenerator('Kuba', 'lorem ipsum');

        //Assert
        expect(actual).toInclude({ from: expected.from });
    })
});

describe('locationMessageGenerator()', () => {
    it('should generate proper location object', () => {
        //Assemble
        expected = {
            from: 'Kuba',
            url: `https://www.google.com/maps?q=1,2`,
            createdAt: +new Date()
        };
        //Act
        actual = locationMessageGenerator('Kuba', 1, 2);
        //Assert
        expect(actual).toInclude({ url: expected.url });
    });
});