import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore,AngularFirestoreDocument, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/firestore';
import { ITask } from '../../shared/interfaces/IFirebase';
import { Observable } from 'rxjs';
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

	public getProjects() {

		return this.firestore.collection('users').doc(this.uid).get().pipe(
			map( doc => {
				if (doc.exists) {
					return doc.data();
				} else {
					throw console.error( `Uid ${this.uid} does not exist` );
				}
			}),
			map( userData => userData.projects ),
			map( project => {
				console.log(project)
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
