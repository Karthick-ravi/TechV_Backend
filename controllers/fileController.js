// Aws connection
const AWS = require('aws-sdk')
const multer = require('multer')
AWS.config.update({
    region: 'eu-north-1',
    accessKeyId: "AKIA3FLD4NXZNBU72M5B",
    secretAccessKey: "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",
    maxAttempts: 3, 
    timeout: 5000,
});
const s3 = new AWS.S3();
let bucketName = "techv0324"


const getBucketList = (req, res) => {
    try {
        s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
            if (err) {
                console.error('Error listing buckets:', err);
            } else {
                res.json({ code: 0, message: "Successfully Retrieved", data: data.Contents })
            }
        });
    } catch (error) {
        res.json({ code: 0, message: "Something occurred error" })
    }
};


async function uploadMultipleFiles(req, res) {
    try {
        const filePaths = req.files;

        const promises = filePaths.map(async (filePath) => {
            const params = {
                Bucket: bucketName,
                Key: filePath.originalname,
                Body: filePath.buffer,
            };

            return s3.upload(params).promise();
        });

        const responses = await Promise.all(promises);

        responses.forEach((response) => {
            console.log("Successfully uploaded:", response.Location);
        });

        res.json({ code: 0, message: "Successfully uploaded", data: responses });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ code: 1, message: "Error uploading files", error });
    }
}




const upload = multer({
    limits: {
        fileSize: 10000000000
    },
}).array('files', 50)



const deleteFile = async (req, res) => {
    try {
        let input = req.params

        const params = {
            Bucket: bucketName,
            Key: input.field,
        };
        s3.deleteObject(params, (err, data) => {
            if (err) {
                res.json({ code: 1, message: "Error deleting file from S3:", err })
            } else {
                res.json({ code: 0, message: "File deleted successfully:", data })
    
            }
        });
    } catch (error) {
        res.json({ code: 1, message: "Error deleting file from S3:", error })
    }

    
}

const getSignedUrl = async (req, res) => {
    try {
        console.log(req)
        let input = req.body
        const params = {
            Bucket: bucketName,
            Key: input.field
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.log("err", err)
                res.json({ code: 1, message: "Error signed file from S3:", err })
            } else {
                console.log("data", data)

                res.json({ code: 0, message: "File signed url successfully:", data })

            }
        });
    } catch (error) {
        res.json({ code: 0, message: "Something occurred error:", error })
    }
}
module.exports = { getBucketList, uploadMultipleFiles, upload, deleteFile, getSignedUrl };
