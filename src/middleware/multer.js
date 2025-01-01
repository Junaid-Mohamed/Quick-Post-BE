import multer from "multer";

const getCurrentDate = () => {
    return `${new Date().getDate()}-${new Date().getMonth}-${new Date().getFullYear()}`  
}

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, `${getCurrentDate()}-${file.originalname}`)
    }
})

const upload = multer({storage});

export default upload