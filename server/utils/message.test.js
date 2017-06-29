var expect = require('expect');

var { messageGenerator } = require('./message');

describe('messageGenerator', () => {
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