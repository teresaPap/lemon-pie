import { Injectable } from '@angular/core';
import { map, switchMap, tap, finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable()
export class FilesService {

	constructor(
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage
	) { }


	
	public uploadFile( file, projectId ) {

		const action = this.storeFile(file, projectId)
			.subscribe( downloadURL => {
				let fileData = {
					name: file.name,
					path: 'blah'
				};
				this.create( {...fileData, downloadURL:downloadURL }, projectId)
			}
		)
		return action;
	}


	private storeFile(file:File, projectId:string): Observable<string> {

		const action = this.fireStorage.upload( `files/${projectId}`, file )
		
		// .then(
		// 	res => {
		// 		console.log('res.downloadURL: '+ res );
		// 		return res.downloadURL 
		// 	}
		// );

		return from(action).pipe(
			switchMap => 
				this.fireStorage.ref(`files/${projectId}`).getDownloadURL()
		);
	}

	private create( fileData , projectId:string ) {
		const filesCollectionRef: AngularFirestoreCollection = this.firestore.collection('files');
		const projectIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`projects/${projectId}`);

		const action = filesCollectionRef.add(
			fileData
		).then((documentRef: firebase.firestore.DocumentReference) => {
				projectIdDocumentRef.update({
					"files": firebase.firestore.FieldValue.arrayUnion(documentRef) 
				})
			}).catch( error => {
				throw console.warn(error); //TODO: Handle error				
			});

		return from(action);
	}


	


	// works

	public read(projectId:string): Observable<any[]> {
		const action = this.firestore.doc(`projects/${projectId}`).get().pipe(
			// Read files[] from given projectId
			map((project: firebase.firestore.DocumentData) => {
				if (project.data().files) 
					return project.data().files;
				else 
					// TODO: handle no projects error! Escape pipe and return empty []
					throw 'no files for this project!';
			}),
			// For each of the files referenced by this project, get the actual document
			switchMap((projects: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				projects.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc( documentRef.path ).get())
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map((project: firebase.firestore.DocumentData) => {
				const projectData = [];
				project.forEach(documentSnapsot =>
					projectData.push({ id: documentSnapsot.id, ...documentSnapsot.data() })
				);
				return projectData;
			})
		)

		return action;
	}

}


