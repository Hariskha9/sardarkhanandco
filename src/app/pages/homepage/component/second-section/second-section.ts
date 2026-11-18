import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-second-section',
  imports: [],
  templateUrl: './second-section.html',
  styleUrl: './second-section.css',
})
export class SecondSection implements AfterViewInit {

  @ViewChild('myVideo') video!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.video.nativeElement;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    video.play();
  }
}
