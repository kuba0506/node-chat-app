var expect = require('expect');

var { Users } = require('./users');

describe('Users', () => {
    var users;
    var actual;
    var expected;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Tom',
            room: 'NodeJS'
        }, {
            id: '2',
            name: 'Paul',
            room: 'NodeJS'
        }, {
            id: '3',
            name: 'Anne',
            room: 'Angular'
        }];
    });

    // afterEach(() => {
    //     users = null;
    // });

    it('should create a new users object',() => {
        expect(users.users).toExist();
    });

    describe('addUser()', () => {
        it('should add a new user', () => {
            //Assemble
            var user = {
                id: '223',
                name: 'Kuba',
                room: 'Warsaw'
            };
            //Act
            actual = users.addUser(user);
            //Assert
            expect(actual).toEqual(user);
            // expect(users.users.length).toBe(1);
        });
    });

    describe('getAllUsers()', () => {
        it('should return array of users for specific room', () => {
            var userList = users.getAllUsers('NodeJS');
            // expect(userList.length).toBe(2);
            expect(userList).toEqual(['Tom', 'Paul']);
        });
    });

    describe('removeUser()', () => {
        it('remove user with specific id', () => {
            //Act
            actual = users.removeUser(1);
            //Assemble
            expect(users.users.length).toBe(2);
        });

        it('should not remove user if not found', () => {
            //Act
            actual = users.removeUser(1);
            console.log(actual)
            //Assemble
            expect(users.users.length).toBe(2);
        });
    });

    describe('getUser()', () => {
        it('should find a user', () => {
            //Act
            actual = users.getUser(1);
            //Assert
            expect(actual).toInclude(users.users[0]);
        });
        it('should not find a user if id is wrong', () => {
            //Act
            actual = users.getUser(1123);
            //Assert
            expect(actual).toNotExist();
        });
    });

});