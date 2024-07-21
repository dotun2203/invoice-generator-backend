import multer from 'multer';

export const upload = multer({
  dest: '../uploads',
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('only image files are allowed'));
    }
    cb(null, true);
  },
});
