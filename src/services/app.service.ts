import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import {
  IMembersResponse,
  IMembersResponseData,
  RequestStatusTypesEnum,
} from 'src/interfaces/members-response.interface';
import { Tournament } from 'src/interfaces/tournament';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private readonly http: HttpClient) {}

  public tournament$: Observable<Tournament> =
    this.getTournamentMembers$().pipe(this.createTournamentBrackets$());

  private getTournamentMembers$(): Observable<IMembersResponseData[]> {
    return this.http.get<IMembersResponse>('/assets/tournament.json').pipe(
      map((response) => {
        if (response.status === RequestStatusTypesEnum.ERROR) return [];
        return response.data;
      }),
      catchError((error) => {
        throw new Error(`An error occured: ${error}`);
      })
    );
  }

  public createTournamentBrackets$(): (
    source$: Observable<IMembersResponseData[]>
  ) => Observable<Tournament> {
    return (source$: Observable<IMembersResponseData[]>) => {
      return source$.pipe(
        map((members) => {
          return new Tournament(members);
        })
      );
    };
  }
}
