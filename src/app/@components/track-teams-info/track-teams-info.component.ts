import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScoreTrackerConstants } from '../../@constants/score-tracker-constants';
import {
  TeamsList,
  AllTeamsList,
  SelctedTeam,
  SelectedTeamInfo,
} from '../../@models/score-tracker-models';
import { ScoreTrackerInfoService } from '../../@services/score-tracker-info.service';

@Component({
  selector: 'app-track-teams-info',
  templateUrl: './track-teams-info.component.html',
  styleUrls: ['./track-teams-info.component.css'],
})
export class TrackTeamsInfoComponent implements OnInit, OnDestroy {
  trackTeamsFormGroup: FormGroup = new FormGroup({});
  allTeamsList: TeamsList[] = [];
  selectedTeam: SelectedTeamInfo[] = [];
  teamLogoUrl: string = ScoreTrackerConstants.LOGO_URL;
  hasLoading: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(
    private readonly scoreTrackerInfoService: ScoreTrackerInfoService
  ) {}

  ngOnInit(): void {
    this.createScoreTrackerForm();
    this.getDataFromStore();
    this.getAllTeamsListInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createScoreTrackerForm(): void {
    this.trackTeamsFormGroup = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
    });
  }

  getAllTeamsListInfo(): void {
    this.hasLoading = true;
    const getAllTeamsListInfo$: Observable<AllTeamsList> =
      this.scoreTrackerInfoService.getAllTeamsListInfo();
    this.subscriptions.add(
      getAllTeamsListInfo$
        .pipe(
          map((response: AllTeamsList) => {
            this.allTeamsList = response.data;
            this.hasLoading = false;
          })
        )
        .subscribe()
    );
  }

  trackTeamsFormSubmit(): void {
    this.trackTeamsInfo();
  }

  setTeamInfo(team: SelctedTeam, key: string, id: number): string {
    return team.home_team.id === id
      ? team.home_team[key]
      : team.visitor_team[key];
  }

  trackTeamsInfo(): void {
    this.hasLoading = true;
    const { teamName } = this.trackTeamsFormGroup.value;
    if (!teamName) {
      return;
    }
    const getSelectedTeamInformation$ =
      this.scoreTrackerInfoService.getSelectedTeamInformation(teamName);
    this.subscriptions.add(
      getSelectedTeamInformation$
        .pipe(
          map((response: SelectedTeamInfo) => {
            if (response && response.data.length) {
              const teamInfo: SelctedTeam[] = response.data.filter(
                (element: SelctedTeam) =>
                  element.home_team.id === teamName ||
                  element.visitor_team.id === teamName
              );
              const selectedTeam: SelectedTeamInfo = this.getSelectedTeam(
                response,
                teamInfo,
                teamName
              );
              const index = this.selectedTeam.findIndex(
                (x) => x.team_id === selectedTeam.team_id
              );
              index === -1 && this.selectedTeam.push(selectedTeam);
              this.hasLoading = false;
              localStorage.setItem(
                ScoreTrackerConstants.SCORE_TRACKER_DATA,
                JSON.stringify(this.selectedTeam)
              );
            }
            this.hasLoading = false;
            this.trackTeamsFormGroup.controls.teamName.setValue('');
          })
        )
        .subscribe()
    );
  }

  getSelectedTeam(
    response: SelectedTeamInfo,
    teamInfo: SelctedTeam[],
    teamId: number
  ): SelectedTeamInfo {
    return {
      ...response,
      team_logo:
        `${this.teamLogoUrl}${this.setTeamInfo(
          teamInfo[0],
          ScoreTrackerConstants.ABBREVIATION,
          teamId
        )}${ScoreTrackerConstants.FILE_TYPE}` || '',
      team_name: this.setTeamInfo(
        teamInfo[0],
        ScoreTrackerConstants.FULL_NAME,
        teamId
      ),
      team_abbreviation: this.setTeamInfo(
        teamInfo[0],
        ScoreTrackerConstants.ABBREVIATION,
        teamId
      ),
      team_conference: this.setTeamInfo(
        teamInfo[0],
        ScoreTrackerConstants.CONFERENCE,
        teamId
      ),
      team_id: Number(
        this.setTeamInfo(teamInfo[0], ScoreTrackerConstants.ID, teamId)
      ),
    };
  }

  getDataFromStore(): void {
    this.selectedTeam =
      JSON.parse(
        localStorage.getItem(ScoreTrackerConstants.SCORE_TRACKER_DATA)!
      ) || [];
  }

  removeTeam(indx: number): void {
    this.selectedTeam.splice(indx, 1);
    localStorage.setItem(
      ScoreTrackerConstants.SCORE_TRACKER_DATA,
      JSON.stringify(this.selectedTeam)
    );
  }

  setAvgPoints(teamData: SelctedTeam[], teamId: number, type: string): number {
    let averageScore = 0;
    let conceededScore = 0;
    for (const game of teamData) {
      if (teamId === game.home_team.id) {
        averageScore += game.home_team_score;
        conceededScore += game.visitor_team_score;
      } else if (teamId === game.visitor_team.id) {
        averageScore += game.visitor_team_score;
        conceededScore += game.home_team_score;
      }
    }
    const averagePoints: number = Math.round(averageScore / teamData.length);
    const averagePointsConceded: number = Math.round(
      conceededScore / teamData.length
    );
    return type === ScoreTrackerConstants.SCORED
      ? averagePoints
      : averagePointsConceded;
  }

  setTeamResultInfo(teamData: SelctedTeam, teamId: number): string {
    if (teamData.home_team.id === teamId) {
      return teamData.home_team_score - teamData.visitor_team_score > 0
        ? ScoreTrackerConstants.WIN
        : ScoreTrackerConstants.LOSS;
    } else if (teamData.visitor_team.id === teamId) {
      return teamData.visitor_team_score - teamData.home_team_score > 0
        ? ScoreTrackerConstants.WIN
        : ScoreTrackerConstants.LOSS;
    }
  }
}
