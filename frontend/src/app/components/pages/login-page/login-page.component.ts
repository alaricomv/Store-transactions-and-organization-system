import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatCheckboxModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  isSubmitted = false;
  returnUrl = '';
  constructor(private formBuilder:FormBuilder, 
    private userService:UserService, 
    private activatedRoute:ActivatedRoute, 
    private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home'; // Default to home if no return URL is provided
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.userService.login({email: this.fc['email'].value, password:this.fc['password'].value, rememberMe: this.fc['rememberMe'].value}).subscribe(()=>{
      this.router.navigate([this.returnUrl]); // Navigate to the return URL after successful login
    });
  }

  onRegisterClick() {
    this.router.navigate(['/register']);
  }
}
