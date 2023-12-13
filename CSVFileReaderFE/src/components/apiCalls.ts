import axios from 'axios';
import {FormData } from "./interface";

const API_BASE_URL = 'http://localhost:3001'; 


export const submitFormData = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.post(API_BASE_URL+`/api/submit-data`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
