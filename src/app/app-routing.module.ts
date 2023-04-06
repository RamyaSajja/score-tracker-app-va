import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackTeamResultsComponent } from './@components/track-team-results/track-team-results.component';
import { TrackTeamsInfoComponent } from './@components/track-teams-info/track-teams-info.component';

const scoreTrackingRoutes: Routes = [
  { path: '', component: TrackTeamsInfoComponent, pathMatch: 'full' },
  { path: 'results/:teamCode ', component: TrackTeamResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(scoreTrackingRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
