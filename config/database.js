if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURL: 'mongodb://nikola:nikola111@ds343985.mlab.com:43985/video-app' }
} else {
    module.exports = { mongoURL: 'mongodb://localhost/videoApp-dev' }
}