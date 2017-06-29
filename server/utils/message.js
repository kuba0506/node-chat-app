var messageGenerator = (from, text) => {
    return {
        from, text,
        createdAt: +new Date()
    };
};

var locationMessageGenerator = (from, latitude, longitude) => {
    return {
        from, 
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: +new Date()
    };
};

module.exports = { messageGenerator, locationMessageGenerator };