import { Component } from '@angular/core';
import { GlossaryComponent } from "../../components/glossary/glossary.component";

@Component({
  selector: 'app-glossary-page',
  standalone: true,
  imports: [GlossaryComponent],
  templateUrl: './glossary-page.component.html',
  styleUrl: './glossary-page.component.css'
})
export class GlossaryPageComponent {

}
