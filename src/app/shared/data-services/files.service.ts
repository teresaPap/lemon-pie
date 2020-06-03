import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { StorageService } from '../services/storage.service';
import { IFile, IFilePreview } from '../interfaces/IFile';

@Injectable({
	providedIn: 'root'
})
export class FilesService {

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage,
		private apiService: FirebaseApiService
	) { }


	public readAllFiles(projectId: string): Observable<any[]> {
		return this.apiService.readDocumentChildReferences(`projects/${projectId}`);
	}

	public create(file: IFilePreview, projectId: string): Observable<IFile|any> {
		return this.apiService.createDocument(file, 'files', `projects/${projectId}`);
	}

	public readSingleFile(fileId: string): Observable<IFile> {
		return of();
	}

	public update(fileId: string, updateData ): Observable<void> {
		return of();
	}

	public delete(fileId: string, projectId: string): Observable<any> {
		return of();
	}

}


