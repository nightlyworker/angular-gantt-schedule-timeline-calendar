import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GSTCComponent } from './gstc/gstc.component';
import { InfoComponent } from './info/info.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [AppComponent, GSTCComponent, InfoComponent, ScheduleComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'info', component: InfoComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
