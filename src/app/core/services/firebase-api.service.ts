import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Observable, forkJoin, from, of, iif} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as firebase from "firebase";


@Injectable()
export class FirebaseApiService {

    public uid: string = this.authService.getCurrentUserId();

    constructor(
    	private authService: AuthService,
		public firestore: AngularFirestore,
	) { }

	public createDocument(fields: any, collectionName: string, parentDocumentName?: string): Observable<any> {

    	const collectionRef: AngularFirestoreCollection = this.firestore.collection(collectionName);
		const parentDocumentRef: AngularFirestoreDocument = this.firestore.doc(parentDocumentName);

		return from( collectionRef.add(fields) ).pipe(
			tap((documentRef: firebase.firestore.DocumentReference) => {
				if (parentDocumentName) {
					parentDocumentRef.update({
						'references': firebase.firestore.FieldValue.arrayUnion(documentRef)
					})
				}
			}),
			switchMap((documentRef: firebase.firestore.DocumentReference) => documentRef.get() ),
			map((documentData: firebase.firestore.DocumentData) => documentData.data() ),
			catchError( err => err )
		);

	}

}
