import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, HelpRoutingModule, MatCardModule, MatGridListModule],
})
export class HelpModule {}
