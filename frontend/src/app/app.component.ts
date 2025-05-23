import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/partials/header/header.component";
import { HomeComponent } from "./components/pages/home/home.component";
import {} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterOutlet, HeaderComponent, HomeComponent, ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
