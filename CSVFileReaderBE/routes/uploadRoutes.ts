import { Router } from 'express';
import { uploadData } from '../controllers/UploadController';

const router = Router();

router.post('/submit-data', uploadData);
// router.get('/get-all-jobs', getAllJobs);

export default router;
