// routes/exampleRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


router.get('/list', fileController.getBucketList);
router.post('/upload', fileController.upload, fileController.uploadMultipleFiles);
router.delete('/delete/:field', fileController.deleteFile);
router.post('/signed/url', fileController.getSignedUrl);

module.exports = router;
