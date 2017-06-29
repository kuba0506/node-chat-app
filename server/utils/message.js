var messageGenerator = (from, text) => {
    return {
        from, text,
        createdAt: +new Date()
    };
};

module.exports = { messageGenerator };