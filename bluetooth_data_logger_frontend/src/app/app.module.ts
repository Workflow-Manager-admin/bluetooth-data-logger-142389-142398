import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LogHistoryComponent } from './components/log-history/log-history.component';
import { RealtimeChartComponent } from './components/realtime-chart/realtime-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LogHistoryComponent,
    RealtimeChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
