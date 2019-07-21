import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore,AngularFirestoreDocument, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/firestore';
import { ITask } from '../../shared/interfaces/IFirebase';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
import { map, switchMap, tap } from 'rxjs/operators';


@Injectable()
export class ApiService {

    public uid: string = this.authService.getCurrentUserId(); 
	
	public tasks: AngularFirestoreCollection<ITask>;
	private taskDoc: AngularFirestoreDocument<ITask>;

    constructor( 
		public firestore: AngularFirestore,
		private authService: AuthService ) { }

	public getProjects(): Observable<any> {
		return this.firestore.doc(`users/${this.uid}`).get().pipe(
			// Check if a user with this uid exists
			map( (user: firebase.firestore.DocumentData) => {
				if (user.exists) return user.data().projects;
				throw console.warn( `Uid ${this.uid} does not exist` ); //TODO: Handle error uid does not exist
			}),
			// For each of the projects referenced by this user, get the actual document
			switchMap( (projects: firebase.firestore.DocumentReference[] ) => {
				const referencesToGet = [];
				projects.forEach( (documentRef : firebase.firestore.DocumentReference) => {
					referencesToGet.push( this.firestore.doc( documentRef.path ).get() )
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map( (project: firebase.firestore.DocumentData) => {
				const projectData = [] ;
				project.forEach( documentSnapsot => projectData.push( documentSnapsot.data() ) );
				return projectData;
			})
		)
	}









	private testGet() {
		console.log("current user: " , this.uid );
		// get test doc.data()
		// return this.getTestDoc().subscribe( doc => {
		// 	if (doc.exists) {
		// 		console.log(doc.data());
		// 	} else {
		// 		console.log('doc does not exist');
		// 	}
		// })	
		// get test collection data
		return this.getTestCollection().pipe(
			map( collection => {
				console.log(collection.docs);
				for (let doc of collection.docs) {
					console.log(doc.data());
				}
			})
		)	
	}
	private getTestDoc(): Observable<any> {
		return this.firestore.collection('users').doc('VUBjSTUEhBTzg5C6PVtpIGqEM9i1').get();
	}
	private getTestCollection(): Observable<any> {
		return this.firestore.collection('users').get();
	}

}
