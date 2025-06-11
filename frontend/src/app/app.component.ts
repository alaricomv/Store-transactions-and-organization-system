import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/partials/header/header.component";
import { HomeComponent } from "./components/pages/home/home.component";
import {} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from "./components/partials/footer/footer.component";

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterOutlet, HeaderComponent, HomeComponent, ReactiveFormsModule, FooterComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  currentLang = 'en';
    
    switchLanguage(lang: string) {
        this.currentLang = lang;
    }
}
