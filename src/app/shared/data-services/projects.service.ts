import { Injectable } from '@angular/core';

import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import * as firebase from 'firebase/app';
import { IProject } from '../interfaces/IProject';

@Injectable()
export class ProjectsService {

    public uid: string = this.authService.getCurrentUserId();

	constructor(
		public firestore: AngularFirestore,
		private authService: AuthService 
	) { }


	public create(project: IProject): Observable<void> {
		const projectsCollectionRef: AngularFirestoreCollection = this.firestore.collection('projects');
		const userIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`users/${this.uid}`);

		const action = projectsCollectionRef.add({
				name: project.name,
				description: project.description,
				createdOn: new Date(Date.now())
			}).then((documentRef: firebase.firestore.DocumentReference) => {
				userIdDocumentRef.update({
					"projects": firebase.firestore.FieldValue.arrayUnion(documentRef) 
				})
			}).catch( error => {
				throw console.warn(error); //TODO: Handle error				
			});

		return from(action);
	}

	public read(): Observable<IProject[]> {
		const action = this.firestore.doc(`users/${this.uid}`).get().pipe(
			// Read projects[] from given uid
			map((user: firebase.firestore.DocumentData) => user.data().projects
			),
			// For each of the projects referenced by this user, get the actual document
			switchMap((projects: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				projects.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc( documentRef.path ).get())
				});
				return forkJoin(referencesToGet);
			}),
			// map( (projects: firebase.firestore.DocumentData) => {
			// 	const projectData = [];
			// 	projects.forEach(documentSnapsot =>
			// 		projectData.push(documentSnapsot.data())
			// 	);
			// 	return projectData;
			// }),
			// Map the DocumentData to the actual json data and return them to the component
			map( (projects: firebase.firestore.DocumentData) => {
				const projectData = [];
				projects.forEach( documentSnapsot =>
					projectData.push({ id: documentSnapsot.id, ...documentSnapsot.data() })
				);
				return projectData;
			}), 
			map( (projectData: IProject[]) => {
				projectData.forEach( elem => {
					if (elem.files) {
						elem.preview = this.getFile( elem.files[0] )
					}
				})
				return projectData;
			})	
		)

		return action;
	}

	public readSingle(projectId:string): Observable<firebase.firestore.DocumentSnapshot> {
		const action = this.firestore.doc(`projects/${projectId}`).get();
		return action;

	}

	private getFile( ref ) {
		return this.firestore.doc( ref ).get().pipe(
			map( file => file.data() )
		);
	}


}
