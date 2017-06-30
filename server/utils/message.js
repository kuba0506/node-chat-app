const moment  = require('moment');

var messageGenerator = (from, text) => {
    return {
        from, text,
        createdAt: moment().valueOf()
    };
};

var locationMessageGenerator = (from, latitude, longitude) => {
    return {
        from, 
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};

module.exports = { messageGenerator, locationMessageGenerator };