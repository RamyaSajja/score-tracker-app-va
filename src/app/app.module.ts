import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TrackTeamResultsComponent } from './@components/track-team-results/track-team-results.component';
import { TrackTeamsInfoComponent } from './@components/track-teams-info/track-teams-info.component';
import { ScoreTrackerInfoService } from './@services/score-tracker-info.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    TrackTeamsInfoComponent,
    TrackTeamResultsComponent,
  ],
  providers: [ScoreTrackerInfoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
