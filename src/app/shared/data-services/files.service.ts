import { Injectable } from '@angular/core';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { IFile, IClickableArea } from '../interfaces/IFile';
import { StorageService } from '../services/storage.service';


@Injectable()
export class FilesService {

	private fileToSaveTemp: IFile; 

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
			map( (links: firebase.firestore.DocumentSnapshot[] ) => {
				const linksData = [];
				links.forEach( snapshot => linksData.push( { ...snapshot.data(), linkedFileId: snapshot.id } ) );
				return linksData;
			})
		)
		return from(action);
	}
	

	public create( file:File, projectId:string ): Observable<void> {

		// TODO: take a File and 
		// save it in firestorage, files collection, projects collection project/files array as a collection ref 
		// return succeed or failed 

		const fileName = `${file.lastModified}_${file.name}`; 

		// Create file document in firestore and this file document ref to projectId
		const createAction = this.storeFileInFireStorage( file, projectId, fileName ).pipe(
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

		return createAction;
	}


	private storeFileInFireStorage( file:File, projectId:string, fileName:string ): Observable<IFile|any> {
		// Reference to storage bucket
		const storageRef = this.fireStorage.ref(`files/${projectId}/${fileName}`) || {} as AngularFireStorageReference;
		
		// Main task
		const uploadTask = this.fireStorage.upload( `files/${projectId}/${fileName}`, file );

		// Progress monitoring 
		// const percentage = uploadTask.percentageChanges();

		const onUploadTaskEnded$: Observable<any> = from( uploadTask );
		
		return uploadTask.snapshotChanges().pipe(
			tap( res => {
				console.log('HEREEEE', res, 'storage ref' , storageRef) ;
			}),
			switchMap( () => onUploadTaskEnded$ ),
			switchMap( () => storageRef.getDownloadURL() ),
			map( downloadUrl => {
				console.log('downloadUrl' , typeof downloadUrl );
				return {
					name: fileName,
					path: `files/${projectId}/${fileName}`,
					downloadURL: downloadUrl 
				};
			}),
			tap( (filedata:IFile | any) => {
				console.log( 'FIRE_STORAGE COMPLETED 1', filedata );
			}),
			catchError( error => {
				console.warn('ERROR IN 104 \n\n' ,  error);
				if (error.code !== 'storage/object-not-found') 
					return error.code;
				else {
					console.log('ERROR CODE: ', error.code );
					return of([]);
				}
			}),
			tap( (filedata:IFile) => {
				if (filedata.downloadURL) console.log( 'FIRE_STORAGE COMPLETED 2', filedata );
			}),
		);

		
	}

	private storeFileInFirestore( fileData: IFile , projectId: string ) {
		const filesCollectionRef: AngularFirestoreCollection = this.firestore.collection('files');
		const projectIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`projects/${projectId}`);

		const action = from( filesCollectionRef.add(fileData) ).pipe(
			switchMap( documentRef =>
				from( 
					projectIdDocumentRef.update(
						{ "files": firebase.firestore.FieldValue.arrayUnion(documentRef) }
				))
			),
			tap( res => console.log( 'FIRE_STORE COMPLETED', res ) ),
			catchError(error => {
				console.warn( 'ERROR IN 147' , error);	
				return of(error);	
			})
		);
		return action;
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
			map((file: firebase.firestore.DocumentData) => {
				const projectData = [];
				file.forEach(snapsot =>
					projectData.push({ id: snapsot.id, ...snapsot.data() })
				);
				return projectData;
			})
		)

		return action;
	}

	public delete( fileId:string, fileName:string, projectId:string ): Observable<any> {

		const fileInProject = this.firestore.doc(`projects/${projectId}`).get().pipe(
			map( res => { 
				const data = res.data();
				const index =  this.findReference( data.files, fileId);
				const updatedFiles: any[] = data.files.slice(index);
				return {files: updatedFiles, index: index}
			}),
			switchMap( res => {
				return from( this.firestore.doc(`projects/${projectId}`).update({files:res.files}) )
			}),
			tap( res => {
				console.log('might have deleted a file, please check firebase ', res);
			}),
		);

		const fileInFiles = this.firestore.doc(`files/${fileId}`).get().pipe(
			switchMap( res => {
				console.log(res);
				if ( res.exists )
					return from( this.firestore.doc(`files/${fileId}`).delete() )
				else 
					console.log('doc does not exist!') 
			}),
			switchMap( res => fileInFirestorage ),
			catchError( error => { 
				console.log(error);
				return 'null';
			})
		);

		// delete files.projectId.file.name from fire storage
		const fileInFirestorage = this.fireStorage.ref(`files/${projectId}/${fileName}`).delete();

		const action = forkJoin( fileInFiles , fileInProject ).pipe(
			catchError( error => { 
				console.log(error);
				return of('error');
			})
		);

		return action;
	}

	private findReference( refs:firebase.firestore.DocumentReference[], refId:string): number {
		let index: number = -1;
		refs.forEach( (ref:firebase.firestore.DocumentReference, i:number) => {
			if (ref.id === refId )
			index = i;
		})
		return index;
	}






}


