import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-page',
    imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  registerForm!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (user) => {
          console.log('User registered successfully:');
        },
        error: (errorResponse) => {
          console.error('Registration failed:', errorResponse);
        }
      });
    }
  }
  onLoginClick() {
    this.router.navigate(['/login']);
  }

}
