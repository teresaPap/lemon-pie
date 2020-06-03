import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, BehaviorSubject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { StorageService } from '../services/storage.service';
import { IFile, IFilePreview } from '../interfaces/IFile';

@Injectable({
	providedIn: 'root'
})
export class FilesService {

	private filesList: IFile[] = [];
	private activeFilesListSource = new BehaviorSubject<IFile[]>([] as IFile[]);

	public activeFilesListChanges$ = this.activeFilesListSource.asObservable();

	constructor(
		public storage: StorageService,
		private firestore: AngularFirestore,
		private fireStorage: AngularFireStorage,
		private apiService: FirebaseApiService
	) { }

	public changeActiveFilesList(): void {
		this.activeFilesListSource.next(this.filesList);
	}

	public readAllFiles(projectId: string): Observable<any[]> {
		return this.apiService.readDocumentChildReferences(`projects/${projectId}`).pipe(
			tap( res => {
				this.filesList = res;
				this.changeActiveFilesList();
			})
		);
	}

	public create(file: IFilePreview, projectId: string): Observable<IFile|any> {
		return this.apiService.createDocument(file, 'files', `projects/${projectId}`).pipe(
			tap( res => {
				this.filesList.push(res);
				this.changeActiveFilesList();
			})
		);
	}

	public readSingleFile(fileId: string): Observable<IFile> {
		return of();
	}

	public update(fileId: string, updateData ): Observable<void> {
		return of();
	}

	public delete(fileId: string, projectId: string): Observable<any> {
		return this.apiService.deleteDocument(`files/${fileId}`, `projects/${projectId}`).pipe(
			tap( res => {
				const index = this.filesList.findIndex(file => file.id = fileId);
				this.filesList.splice(index,1);
				this.changeActiveFilesList();
			})
		);
	}

}


