import { Injectable } from '@angular/core';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of, iif } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { IFile } from '../interfaces/IFile';
import { IClickableArea, ILink } from '../interfaces/ILink';
import { StorageService } from '../services/storage.service';
import {IProjectPreview} from "../interfaces/IProject";


@Injectable()
export class FilesService {

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage
	) { }


	public create(file: File, projectId: string): Observable<any> {

		// NOTE: takes a File and
		// saves it in firestorage, files collection, projects collection project/files array as a collection ref
		// returns;

		const fileName = `${file.lastModified}_${file.name}`;

		// Create file document in firestore and this file document ref to projectId
		return this.storeFileInFireStorage( file, projectId, fileName ).pipe(
			switchMap( filedata => {
				if (filedata.downloadURL) {
					return this.storeFileInFirestore( filedata, projectId );
				} else {
					return of('blah');
				}
			}),
			catchError( error => {
				console.warn('ERROR IN 79 \n' ,  error);
				if (error.code !== 'storage/object-not-found') {
					return of(error.code);
				} else {
					console.log('ERROR CODE: ', error.code );
					return of([]);
				}
			})
		);
	}

	public read(projectId: string): Observable<IFile[]> {
		// NOTE: Reads Files[] (containing file references) from a given ProjectId and
		// returns an observable of an array with the actual files

		return this.firestore.doc(`projects/${projectId}`).get().pipe(
			map((project: firebase.firestore.DocumentData) => {
				if ( project.data().files ) {
					return project.data().files;
				} else {
					// TODO: handle no-projects-error! Escape the pipe and return empty []
					throw new Error('no files for this project!');
				}
			}),
			// For each of the files referenced by this project, get the actual document
			switchMap((files: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				files.forEach( (fileDocRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push( this.firestore.doc( fileDocRef.path ).get() );
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

	public update(fileId: string, updateData ): Observable<void> {
		return from(this.firestore.doc(`files/${fileId}`).update(updateData));
	}

	public delete(fileId: string, fileName: string, projectId: string): Observable<any> {

		const deleteFileFromProject = this.firestore.doc(`projects/${projectId}`).get().pipe(
			map( res => {
				const data = res.data();
				const index = this.findReference(data.files, fileId);
				return { data: data, index: index };
			}),
			map( res => {
				if (res.index !== -1) {
					return [ ...res.data.files.slice(res.data.files.lenght, res.index), ...res.data.files.slice(res.index + 1, res.data.files.lenght) ];
				}
				else { throw new Error('ERROR: File reference does not exist in project!'); }
			}),
			switchMap( files =>  from( this.firestore.doc(`projects/${projectId}`).update({files: files}) )),
			catchError( () => {
				throw new Error('ERROR in delete_File_From_Project');
			})
		);

		const deleteFileFromFilesCollection = from( this.firestore.doc(`files/${fileId}`).delete() ).pipe(
			catchError( () => {
				throw new Error('ERROR in delete_File_From_Files_Collection');
			})
		);

		const deleteFileFromFireStorage = this.fireStorage.ref(`files/${projectId}/${fileName}`).delete().pipe(
			catchError( () => {
				throw new Error('ERROR in delete_File_From_Fire_Storage');
			})
		);

		return forkJoin( [deleteFileFromFilesCollection, deleteFileFromProject, deleteFileFromFireStorage] ).pipe(
			catchError( error => {
				return of(error);
			}),
		);
	}

	// #region - File Update Functions
	public saveFileLink(area: IClickableArea) {
		const activeFile: IFile = this.storage.load('activeFile');
		const fileDocumentRef = this.firestore.doc(`files/${activeFile.id}`)

		return from(this.firestore.collection('links').add(area).then(
			linkDocumentRef => fileDocumentRef.update({
				'links': firebase.firestore.FieldValue.arrayUnion(linkDocumentRef)
			})
		));
	}

	public getFileLinks(fileId: string): Observable<IClickableArea[]> {
		return this.firestore.doc(`files/${fileId}`).get().pipe(
			map( (file: firebase.firestore.DocumentData) => {
				if ( !file.data().links ) throw 'No links for this file';
				return file.data().links
			}),
			switchMap( (links: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				links.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc(documentRef.path).get())
				});
				return forkJoin(referencesToGet);
			}),
			map( (links: firebase.firestore.DocumentData) => {
				const linksData = [];
				links.forEach(documentSnapshot => linksData.push({id: documentSnapshot.id, ...documentSnapshot.data()}));
				return linksData;
			})
		);
	}
	// #endregion


	private findReference(refs: firebase.firestore.DocumentReference[], refId: string): number {
		let index = -1;
		refs.forEach( (ref: firebase.firestore.DocumentReference, i: number) => {
			if (ref.id === refId ) {
			index = i;
			}
		});
		return index;
	}

	private storeFileInFireStorage(file: File, projectId: string, fileName: string): Observable<IFile|any> {
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
				if (error.code !== 'storage/object-not-found') {
					return error.code;
				}
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

		return from( filesCollectionRef.add(fileData) ).pipe(
			switchMap( documentRef =>
				from(
					projectIdDocumentRef.update(
						{ 'files': firebase.firestore.FieldValue.arrayUnion(documentRef) }
				))
			),
			// tap( res => console.log( 'FIRE_STORE COMPLETED', res ) ),
			catchError(error => {
				console.warn( 'ERROR IN 147' , error);
				return of(error);
			})
		);
	}

}


