module.exports = {
  port: 4000,
  mongodb: "mongodb://localhost/badu_navigation",
  upload_dir: 'uploads',
  upload_base_path: '/uploads',
  upload_allow_types: {
    picture: /jpe?g|png|gif|bmp|svg/i
  }
};