import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { StorageService } from '../services/storage.service';
import { IFile } from '../interfaces/IFile';
import { IClickableArea, ILink } from '../interfaces/ILink';

@Injectable()
export class FilesService {

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage,
		private apiService: FirebaseApiService
	) { }


	public create(file: File, projectId: string): Observable<any> {
		return this.apiService.storeFile(file,`files/${projectId}`).pipe(
			catchError( err => err ),
			switchMap( (fileData: IFile) =>
				this.apiService.createDocument(fileData, 'files', `projects/${projectId}`)
			)
		);
	}

	public readAllFiles(projectId: string): Observable<any[]> {
		return this.apiService.readDocumentChildReferences(`projects/${projectId}`);
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
		return this.apiService.createDocument(area,'links',`files/${activeFile.id}` )
	}

	public getFileLinks(fileId: string): Observable<IClickableArea[]> {
		return this.firestore.doc(`files/${fileId}`).get().pipe(
			map( (file: firebase.firestore.DocumentData) => {
				if ( !file.data().references ) throw 'No links for this file';
				return file.data().references
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

	private getFile(ref) {
		return this.firestore.doc(ref).get().pipe(
			map(file => file.data())
		);
	}

}


