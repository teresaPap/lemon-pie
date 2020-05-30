import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IProjectListResolved, IProjectResolved} from "../../../shared/interfaces/IProject";
import {ProjectsService} from "../../../shared/data-services/projects.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";


@Injectable({
	providedIn: 'root'
})
export class ProjectsListResolver implements Resolve<IProjectListResolved> {

	constructor( private projectCtrl: ProjectsService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProjectListResolved> {
		return this.projectCtrl.readAllProjectsForActiveUser().pipe(
			map( res => ({projects: res}) ),
			catchError( err => {
				console.error('Project retrieval error: ', err );
				return of({projects: null, error: err.message})
			})
		);
	}
}