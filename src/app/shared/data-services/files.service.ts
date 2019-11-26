import { Injectable } from '@angular/core';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of, iif } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { IFile, IClickableArea } from '../interfaces/IFile';
import { StorageService } from '../services/storage.service';


@Injectable()
export class FilesService {

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage
	) { }

	
	public create(file:File, projectId:string): Observable<void> {

		// NOTE: takes a File and 
		// saves it in firestorage, files collection, projects collection project/files array as a collection ref 
		// returns;

		const fileName = `${file.lastModified}_${file.name}`; 

		// Create file document in firestore and this file document ref to projectId
		return this.storeFileInFireStorage( file, projectId, fileName ).pipe(
			switchMap( filedata => {
				if (filedata.downloadURL) 
					return this.storeFileInFirestore( filedata, projectId ) 
				else 
					return of('blah')
			}),
			catchError( error => {
				console.warn('ERROR IN 79 \n' ,  error);
				if (error.code !== 'storage/object-not-found') 
					return of(error.code);
				else {
					console.log('ERROR CODE: ', error.code );
					return of([]);
				}
			})
		);
	}

	public read(projectId:string): Observable<IFile[]> {
		// NOTE: Reads Files[] (containing file references) from a given ProjectId and 
		// returns an observable of an array with the actual files
		
		return this.firestore.doc(`projects/${projectId}`).get().pipe(
			map((project: firebase.firestore.DocumentData) => {
				if ( project.data().files ) 
					return project.data().files;
				else 
					// TODO: handle no projects error! Escape pipe and return empty []
					throw 'no files for this project!';
			}),
			// For each of the files referenced by this project, get the actual document
			switchMap((files: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				files.forEach( (fileDocRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push( this.firestore.doc( fileDocRef.path ).get() )
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map( (file: firebase.firestore.DocumentData) => {
				const projectData = [];
				file.forEach(snapsot =>
					projectData.push({ id: snapsot.id, ...snapsot.data() })
				);
				return projectData;
			})
		);
	}

	public delete(fileId:string, fileName:string, projectId:string): Observable<any> {

		const deleteFileFromProject = this.firestore.doc(`projects/${projectId}`).get().pipe(
			map( res => { 
				const data = res.data();
				const index = this.findReference(data.files, fileId);
				return { data: data, index: index };
			}),
			map( res => {
				if (res.index !== -1) 
					return [ ...res.data.files.slice(res.data.files.lenght, res.index), ...res.data.files.slice(res.index+1, res.data.files.lenght) ]
				else throw 'ERROR: File reference does not exist in project!';
			}),
			switchMap( files =>  from( this.firestore.doc(`projects/${projectId}`).update({files:files}) )),
			catchError( () => {
				throw 'ERROR in delete_File_From_Project';
			})
		);

		const deleteFileFromFilesCollection = from( this.firestore.doc(`files/${fileId}`).delete() ).pipe(
			catchError( () => {
				throw 'ERROR in delete_File_From_Files_Collection';
			})
		);

		const deleteFileFromFireStorage = this.fireStorage.ref(`files/${projectId}/${fileName}`).delete().pipe(
			catchError( () => {
				throw 'ERROR in delete_File_From_Fire_Storage';
			})
		);

		return forkJoin( deleteFileFromFilesCollection, deleteFileFromProject, deleteFileFromFireStorage ).pipe(
			// map( () => console.log('END DELETE') ),
			catchError( error => { 
				// console.log('ERROR!: ', error);
				return of(error);
			}),
		);
	}

	// #region - File Update Functions	
	public saveFileLink(area: IClickableArea) {
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

	public getFileLinks(fileId: string): Observable<IClickableArea[]> {
		const linksCollection = this.firestore.collection(`files/${fileId}/links`);

		const getLinksData = (linkSnapshots: firebase.firestore.DocumentSnapshot[]) => 
			linkSnapshots.map(snapshot => ({...snapshot.data(), linkedFileId: snapshot.id}));

		const action = linksCollection.get().pipe(
			mergeMap(links => 
				iif(() => (links.docs.length>0) , of(getLinksData(links.docs)) , of(null))
			)
		);
		
		return from(action);
	}
	// #endregion


	private findReference(refs: firebase.firestore.DocumentReference[], refId: string): number {
		let index: number = -1;
		refs.forEach( (ref:firebase.firestore.DocumentReference, i:number) => {
			if (ref.id === refId )
			index = i;
		});
		return index;
	}

	private storeFileInFireStorage(file:File, projectId:string, fileName:string): Observable<IFile|any> {
		// Reference to storage bucket
		const storageRef = this.fireStorage.ref(`files/${projectId}/${fileName}`) || {} as AngularFireStorageReference;
		
		// Main task
		const uploadTask = this.fireStorage.upload( `files/${projectId}/${fileName}`, file );

		// Progress monitoring 
		// const percentage = uploadTask.percentageChanges();

		const onUploadTaskEnded$: Observable<any> = from( uploadTask );
		
		return uploadTask.snapshotChanges().pipe(
			switchMap( () => onUploadTaskEnded$ ),
			switchMap( () => storageRef.getDownloadURL() ),
			map( downloadUrl => {
				return {
					name: fileName,
					path: `files/${projectId}/${fileName}`,
					downloadURL: downloadUrl 
				};
			}),
			catchError( error => {
				console.warn('ERROR IN 104 \n\n' ,  error);
				if (error.code !== 'storage/object-not-found') 
					return error.code;
				else {
					console.log('ERROR CODE: ', error.code );
					return of([]);
				}
			})
		);
	}

	private storeFileInFirestore(fileData: IFile , projectId: string) {
		const filesCollectionRef: AngularFirestoreCollection = this.firestore.collection('files');
		const projectIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`projects/${projectId}`);

		const action = from( filesCollectionRef.add(fileData) ).pipe(
			switchMap( documentRef =>
				from( 
					projectIdDocumentRef.update(
						{ "files": firebase.firestore.FieldValue.arrayUnion(documentRef) }
				))
			),
			// tap( res => console.log( 'FIRE_STORE COMPLETED', res ) ),
			catchError(error => {
				console.warn( 'ERROR IN 147' , error);	
				return of(error);	
			})
		);
		return action;
	}

}


