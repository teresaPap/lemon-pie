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

	public createDocument(documentFields: any, collectionPath: string, parentDocPath?: string): Observable<any> {
    	const collectionRef: AngularFirestoreCollection = this.firestore.collection(collectionPath);
		const parentDocumentRef: AngularFirestoreDocument = this.firestore.doc(parentDocPath);

		return from( collectionRef.add(documentFields) ).pipe(
			tap((documentRef: firebase.firestore.DocumentReference) =>
				iif(() => !!parentDocPath,
					parentDocumentRef.update({
						'references': firebase.firestore.FieldValue.arrayUnion(documentRef)
					})
				),
			),
			switchMap((documentRef: firebase.firestore.DocumentReference) => documentRef.get() ),
			map((documentData: firebase.firestore.DocumentData) => documentData.data() ),
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

	public deleteDocument(docPath: string) {
		return this.deleteDocumentReferences(docPath).pipe(
			switchMap(() => this.firestore.doc(docPath).delete() ),
			catchError(err => {
				console.error(err);
				return of('Delete failed')
			}),
			map(() => 'Delete succeed'),
		)
	}

	private deleteDocumentReferences(docPath: string) {
		return this.firestore.doc(docPath).get().pipe(
			map((snapshot: firebase.firestore.DocumentSnapshot) => snapshot.get('references')),
			switchMap((refs: firebase.firestore.DocumentReference[]) => defer( () => (refs && !!refs.length)
				? forkJoin( refs.map(ref => ref.delete()) )
				: of('No references array found'),
			)),
			catchError(err => {
				console.error('MERGE MAP ERROR', err);
				return of(err);
			})
		)
	}


	// TODO: on document read also clean up unused references

}




