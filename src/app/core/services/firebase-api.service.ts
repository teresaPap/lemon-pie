import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from, iif } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';


import * as firebase from 'firebase';


@Injectable()
export class FirebaseApiService {

    public uid: string = this.authService.getCurrentUserId();

    constructor(
    	private authService: AuthService,
		public firestore: AngularFirestore,
	) { }

	public createDocument(documentFields: any, collectionPath: string, parentDocPath?: string): Observable<any> {
    	const collectionRef: AngularFirestoreCollection = this.firestore.collection(collectionPath);
		const parentDocumentRef: AngularFirestoreDocument = this.firestore.doc(parentDocPath);

		return from( collectionRef.add(documentFields) ).pipe(
			tap((documentRef: firebase.firestore.DocumentReference) =>
				iif(() => !!parentDocPath,
					from(parentDocumentRef.update({
						'references': firebase.firestore.FieldValue.arrayUnion(documentRef)
					}))
				),
			),
			tap( res => console.log(res)),
			switchMap((documentRef: firebase.firestore.DocumentReference) => documentRef.get() ),
			map((documentData: firebase.firestore.DocumentData) => documentData.data() ),
			catchError( err => err )
		);
    }


}
