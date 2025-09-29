import { Component, inject } from '@angular/core';
import { DemoService } from '../../services/demo/demo.service';


@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo {
  private readonly demo = inject(DemoService);
  ngOnInit() {
    this.demo.startDemo()
  }

}
