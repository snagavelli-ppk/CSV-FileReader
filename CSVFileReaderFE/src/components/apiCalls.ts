import axios from 'axios';

export const submitFormData = async (email: string, selectedFileName: string, csvData: any[]) => {
  try {
    const response = await axios.post('http://your-backend-api/submit', {
      email,
      selectedFileName,
      csvData,
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
