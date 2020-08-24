import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { LayoutService } from '../service/layout.service';

import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  align: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit, OnDestroy {
  deviceXs: boolean;
  mediaSub: Subscription;

  // angDetailText = 'Angular Material | Flex Layout | Angular Icon';
  color1 = 'rgb(103,58,183)';
  color2 = '';
  color3 = 'rgb(192,173,228)';

  constructor(
    private mediaObserver: MediaObserver,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.deviceXs =
          result.mqAlias == 'sm' || result.mqAlias == 'xs' ? true : false;
      }
    );
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }
}
