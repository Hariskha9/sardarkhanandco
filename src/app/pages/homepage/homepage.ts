import { Component } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { SecondSection } from './component/second-section/second-section';
import { ThirdSection } from './component/third-section/third-section';
import { Sardarmonograph } from './component/sardarmonograph/sardarmonograph';
import { Process } from '../../shared-component/process/process';
import { NumberBar } from '../../shared-component/number-bar/number-bar';

@Component({
  selector: 'app-homepage',
  imports: [HeroSection, SecondSection, ThirdSection, Sardarmonograph, Process, NumberBar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
