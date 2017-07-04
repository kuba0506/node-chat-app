class Users {
    constructor() {
        this.users = [];
    }

    addUser({id, name, room}) {
        let user = { id, name, room };
        this.users.push(user);
        
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUserByName(name) {
        return this.users.filter(user => (user.name).toLowerCase() === (name).toLowerCase())[0];
    }

    getAllUsers(room) {
        return this.users.filter(user => user.room === room)
                                .map(user => user.name); 
    }
}

module.exports = { Users };