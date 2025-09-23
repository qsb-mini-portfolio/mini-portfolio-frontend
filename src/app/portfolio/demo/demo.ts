import {Component, inject, OnInit} from '@angular/core';
import {DemoService} from '../services/demo.service';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo implements OnInit {
  private readonly demo = inject(DemoService);
  ngOnInit() {
    this.demo.startDemo()
  }

}
