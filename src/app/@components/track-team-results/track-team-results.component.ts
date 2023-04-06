import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectedTeamInfo, Team } from '../../@models/score-tracker-models';
import { ScoreTrackerConstants } from '../../@constants/score-tracker-constants';

@Component({
  selector: 'track-team-results',
  templateUrl: './track-team-results.component.html',
  styleUrls: ['./track-team-results.component.css'],
})
export class TrackTeamResultsComponent implements OnInit {
  hasLoading: boolean = false;
  selectedTeamInfo: SelectedTeamInfo;
  selectedTeam: Team;
  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const { params } = this.activatedRoute.snapshot;
    const teamName: string = Object.values(params)[0];
    this.hasLoading = true;
    const teamsInfo: SelectedTeamInfo[] =
      JSON.parse(
        localStorage.getItem(ScoreTrackerConstants.SCORE_TRACKER_DATA)!
      ) || [];
    this.getTeamInfo(teamsInfo, teamName);
  }

  getTeamInfo(teamsInfo: SelectedTeamInfo[], teamName: string): void {
    this.selectedTeamInfo =
      teamsInfo &&
      teamsInfo.find(
        (team: SelectedTeamInfo) => team.team_abbreviation === teamName
      );
    this.hasLoading = false;
  }
}
