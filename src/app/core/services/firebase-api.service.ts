import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Observable, from, iif, forkJoin, of, defer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { IFile } from '../../shared/interfaces/IFile';


@Injectable()
export class FirebaseApiService {

    public uid: string = this.authService.getCurrentUserId();

    constructor(
    	private authService: AuthService,
		private fireStorage: AngularFireStorage,
		public firestore: AngularFirestore,
	) { }

	// CREATE

	public createDocument(documentFields: any, collectionPath: string, parentDocPath?: string): Observable<any> {
		return from( this.firestore.collection(collectionPath).add(documentFields) ).pipe(
			tap( res => {
				console.log(1);
				console.log(parentDocPath, !!parentDocPath);
				console.log(2);
			}),
			tap((documentRef: firebase.firestore.DocumentReference) => {
				if (!!parentDocPath) {
					this.updateDocument(parentDocPath, {
						'references': firebase.firestore.FieldValue.arrayUnion(documentRef)
					})
				}
			}),
			tap( res => {
				console.log(3);
				console.log('res', res);
				console.log(4);
			}),
			switchMap((documentRef: firebase.firestore.DocumentReference) => documentRef.get() ),
			map((documentData: firebase.firestore.DocumentData) => {
				return {id: documentData.id, ...documentData.data()}
			}),
			catchError( err => err )
		);
    }

    public storeFile(file: File, path: string ): Observable<IFile|any> {
		const uploadTask: AngularFireUploadTask = this.fireStorage.upload( `${path}/${file.name}`, file );

		return from(uploadTask).pipe(
			switchMap(() => this.fireStorage.ref(`${path}/${file.name}`).getDownloadURL() ),
			map( (downloadURL: string) => {
				return { name: file.name, path: `${path}/${file.name}`, downloadURL: downloadURL }
			}),
			catchError( err => err )
		);
	}


	// READ

	public readDocument(docPath: string): Observable<any> {
		return this.firestore.doc(docPath).get().pipe(
			switchMap((documentSnapshot: firebase.firestore.DocumentSnapshot) => defer(() => documentSnapshot.exists
				? of({id: documentSnapshot.id, ...documentSnapshot.data()} )
				: of({})
			))
		)
	}

	public readDocumentChildReferences(docPath: string): Observable<any[]> {
    	return this.readDocument(docPath).pipe(
			map( (documentData: firebase.firestore.DocumentData) => documentData.references ),
			switchMap((refs: firebase.firestore.DocumentReference[]) => defer( () => (refs && !!refs.length)
				? forkJoin( refs.map(ref => ref.get()) )
				: of('This document has no child references'),
			)),
			switchMap( (res: firebase.firestore.DocumentSnapshot[] | string) =>
				of(typeof res !== 'string' ? res.map(snapshot => ({id: snapshot.id, ...snapshot.data()}) ) : [] ),
			),
		)
	}

	// UPDATE

	public updateDocument(docPath:string, docFields: any) {
    	return from(this.firestore.doc(docPath).update(docFields));
	}


	// DELETE

	public deleteDocument(docPath: string, parentDocPath?: string): Observable<string> {
		return this.deleteDocumentChildReferences(docPath).pipe(
			switchMap(() => this.firestore.doc(docPath).delete() ),
			tap(() => iif(() => !!parentDocPath,
					this.updateDocument(parentDocPath, {
						'references': firebase.firestore.FieldValue.arrayRemove( this.firestore.doc(docPath).ref )
					})
				),
			),
			catchError(err => {
				console.error(err);
				return of('Delete failed')
			}),
			map(() => 'Delete succeed'),
		)
	}

	private deleteDocumentChildReferences(docPath: string): Observable<any> {
		return this.firestore.doc(docPath).get().pipe(
			map((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.get('references')),
			switchMap((refs: firebase.firestore.DocumentReference[]) => defer( () => (refs && !!refs.length)
				? forkJoin( refs.map(ref => ref.delete()) )
				: of('This document has no child references'),
			)),
			catchError(err => {
				console.error(err);
				return of(err);
			})
		)
	}


}




