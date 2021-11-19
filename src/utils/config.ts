export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

export const hashuraEndpoint = 'https://backend-test.hasura.app/v1/graphql'