import { Injectable } from '@angular/core';
import { map, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { IFile, IClickableArea } from '../interfaces/IFile';
import { StorageService } from '../services/storage.service';


@Injectable()
export class FilesService {

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage
	) { }



	public saveFileLink( area: IClickableArea ) {
		const areaCoordinates = {
			x1: area.x1,
			y1: area.y1,
			x2: area.x2,
			y2: area.y2
		};
		const activeFile = this.storage.load('activeFile');
		
		const action = this.firestore.collection(`files/${activeFile.id}/links`).doc(area.linkedFileId).set(areaCoordinates)
			.then( () => console.log('Link Created Successfully') )
			// TODO: handle errors
			.catch( error => console.log('An error occured: ', error ))

		return from(action);
	}

	public getFileLinks( fileId: string ): Observable<IClickableArea[]> {
		const linksCollection = this.firestore.collection(`files/${fileId}/links`);
		const action = linksCollection.get().pipe(
			map( links => {
				if ( links.docs.length ) 
					return links.docs;
				else
					throw 'This file has no links';
			}),
			// For each of the snapshots, get the document data
			switchMap( (links: firebase.firestore.DocumentSnapshot[]) => {
				const linksData = [];
				console.log( links );
				links.forEach( snapshot => linksData.push( { ...snapshot.data(), linkedFileId: snapshot.id } ) );

				return linksData;
			}), 
			tap( res => console.log(res))
		)
		return from(action);
	}
	

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

	public delete( fileId: string, fileName: string, projectId:string ) {

		// TODO: delete project.file.id reference from projects collection - somehow! 
	
		// delete file.id from files collection
		const deleteFromFirestore = this.firestore.doc(`files/${fileId}`).delete();

		// delete files.projectId.file.name from fire storage
		const deleteFromFirestorage = this.fireStorage.ref(`files/${projectId}/${fileName}`).delete();

		const action = forkJoin( from(deleteFromFirestore), deleteFromFirestorage ).pipe(
			map( res => {
				console.log('File deleted successfully!')
				return 'File deleted successfully!';
			})
		);

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


