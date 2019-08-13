import { Injectable } from '@angular/core';
import { map, switchMap, tap, finalize, retry, catchError, withLatestFrom, publishLast } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { IFile } from '../interfaces/IFile';


@Injectable()
export class FilesService {

	constructor(
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage
	) { }


	
	public saveFileLinkedToProject( file:File, projectId:string, fileName:string ): Observable<void> {

		// Store the file in firebase storage
		const storeAction = this.storeFile( file, projectId, fileName ); 

		// Create file document in firestore and this file document ref to projectId
		const createAction = storeAction.pipe(
			switchMap( filedata => this.create( filedata, projectId ) ));

		return createAction;
	}


	public create( fileData: IFile , projectId: string ) {
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


	public read(projectId:string): Observable<any[]> {
		const action = this.firestore.doc(`projects/${projectId}`).get().pipe(
			// Read files[] from given projectId
			map((project: firebase.firestore.DocumentData) => {
				if ( project.data().files ) 
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


	private storeFile( file:File, projectId:string, fileName:string ): Observable<IFile> {

		const uploadPath = `files/${projectId}/${fileName}`;

		// Reference to storage bucket
		const ref = this.fireStorage.ref(uploadPath);
		
		// Main task
		const uploadTask = this.fireStorage.upload( uploadPath, file );
		
		// NOTE: comment in if needed
		// Progress monitoring 
		// this.percentage = this.uploadTask.percentageChanges();

		const monitorSnapshotAction = uploadTask.snapshotChanges().pipe(
			withLatestFrom( ref.getDownloadURL() ),
			map( res => {
				// console.log('\ndownloadURL: ', res[1] );
				// NOTE: res[0] is an upload task progress object, res[1] is the returned string from withLatestFrom rxjs opperator. 
				return res[1];
			}), 
			map( downloadUrl => {
				const fileData: IFile = {
					name: fileName,
					path: uploadPath,
					downloadURL: downloadUrl 
				};
				return fileData;
			})
		)
		return monitorSnapshotAction;
	}


}


