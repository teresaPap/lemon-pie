import { Injectable } from '@angular/core';

import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { elementStart } from '@angular/core/src/render3/instructions';
import * as firebase from 'firebase/app';

@Injectable()
export class ProjectsService {

    public uid: string = this.authService.getCurrentUserId();

	constructor(
		public firestore: AngularFirestore,
		private authService: AuthService 
	) { }


	public create(projectName: string) {
		const projectsCollectionRef: AngularFirestoreCollection = this.firestore.collection('projects');
		const userIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`users/${this.uid}`);

		const action = projectsCollectionRef.add({
				name: projectName,
				createdOn: new Date(Date.now())
			})
			
			// TODO: fix this
			
			// .then((documentRef: firebase.firestore.DocumentReference) => {
			// 	userIdDocumentRef.update({
			// 		"projects": firebase.firestore.FieldValue.arrayUnion( documentRef.id ) 
			// 	});
			// })

			// .then ((documentRef: firebase.firestore.DocumentReference) => documentRef.id )
			.catch( error => {
				throw console.warn(error); //TODO: Handle error				
			});

		return from(action);
	}

	public read(): Observable<any> {
		const action = this.firestore.doc(`users/${this.uid}`).get().pipe(
			// Check if a user with this uid exists
			map((user: firebase.firestore.DocumentData) => {
				if (user.exists) return user.data().projects;
				throw console.warn(`Uid ${this.uid} does not exist`); //TODO: Handle error uid does not exist
			}),
			// For each of the projects referenced by this user, get the actual document
			switchMap((projects: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				projects.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc(documentRef.path).get())
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map((project: firebase.firestore.DocumentData) => {
				const projectData = [];
				project.forEach(documentSnapsot => projectData.push(documentSnapsot.data()));
				return projectData;
			})
		)

		return action;
	}

}
