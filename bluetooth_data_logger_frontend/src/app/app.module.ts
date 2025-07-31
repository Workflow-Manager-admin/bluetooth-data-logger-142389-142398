import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Use direct imports for all components instead of index.ts
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
    // No need to import CommonModule here; BrowserModule already brings it
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
