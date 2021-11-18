import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { applicationDefault } from 'firebase-admin/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@utils/config';

initializeApp(firebaseConfig)

initializeAdminApp({
    credential: applicationDefault()
})