import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { credential, ServiceAccount } from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import privateKey  from '../google-private-key.json'

initializeApp({
    apiKey: process.env.FIREBASE_API_KEY
})

initializeAdminApp({
    credential: credential.cert(privateKey as ServiceAccount)
})