import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB2Nhd2OfOYD-DmLFONaqPBADoGRrmkGKE',
  authDomain: 'placfy-c831f.firebaseapp.com',
  projectId: 'placfy-c831f',
  storageBucket: 'placfy-c831f.firebasestorage.app',
  messagingSenderId: '828688193019',
  appId: '1:828688193019:web:81ee7e187ea3c23265275e',
  measurementId: 'G-7S2M3K9WGM',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)


