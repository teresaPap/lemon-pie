import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";


admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!!");
});


export const getAllUsers = functions.https.onRequest(async (request, response) => {
	const snapshot = await firestore.collection('users').get();
	const users = snapshot.docs.map(doc => ( {id: doc.id, ...doc.data() }) );

	response.json({ users });
});

// export const getProjects = functions.https.onRequest(async (request, response) => {
// 	const snapshot = await firestore.collection()
// })

export const deleteUser = functions.firestore.document('users/{userId}').onDelete( async (snapshot, context) => {
	const subCollection = snapshot.get('projects');
	console.log('subCollection', subCollection);

	return 'My function runs smoothly';
});



