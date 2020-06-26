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
			tap((documentRef: firebase.firestore.DocumentReference) => {
				if (!!parentDocPath) {
					this.updateDocument(parentDocPath, {
						'references': firebase.firestore.FieldValue.arrayUnion(documentRef)
					})
				}
			}),
			switchMap((documentRef: firebase.firestore.DocumentReference) => documentRef.get() ),
			map((documentData: firebase.firestore.DocumentData) => {
				return {id: documentData.id, ...documentData.data()}
			}),
			catchError( err => err )
		);
    }

    public createDocumentWithGivenId(documentFields: any, documentId: string, collectionPath: string): Observable<any> {
    	return from( this.firestore.collection(collectionPath).doc(documentId).set(documentFields) ).pipe(
			// tap(res => console.log(res) )
		)
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
	// TODO: delete is still buggy. It deletes only the first level of child references.

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




