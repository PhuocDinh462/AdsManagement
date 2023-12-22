// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAnz77QXGaJg8IofStPcGOZaNkz1D7ptxY',
  authDomain: 'wncuploadimage.firebaseapp.com',
  projectId: 'wncuploadimage',
  storageBucket: 'wncuploadimage.appspot.com',
  messagingSenderId: '818247038773',
  appId: '1:818247038773:web:487855f0ebf507cbb2fe7c',
  measurementId: 'G-GHMFY996H2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

