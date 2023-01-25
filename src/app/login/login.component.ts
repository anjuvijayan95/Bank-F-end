import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMsg:string=''
  successMsg:boolean=false

  loginForm=this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]]
  })
  constructor(private fb:FormBuilder, private apiCall:ApiService,private route:Router){}
  
  
  login(){


    if(this.loginForm.valid){ 
      // alert('yes here your login')
    let acno=this.loginForm.value.acno
    let pswd=this.loginForm.value.pswd
      
    //login api call
    this.apiCall.login(acno,pswd)
    .subscribe(
      //success
      (result:any)=>{
        this.successMsg=true
        //store username in localstorage
        localStorage.setItem("username",result.username)
        //store currentAcno
        localStorage.setItem("currentAcno",JSON.stringify(result.currentAcno))
        //store token
        localStorage.setItem("token",result.token)
      // alert(result.message)
      setTimeout(()=>{
        this.route.navigateByUrl('dashboard')
     },2000)

      
    },
    //client error
    (result:any)=>{
      this.errorMsg=result.error.message
      setTimeout(()=>{
        this.errorMsg=""
        this.loginForm.reset()
      },3000)
      //navigate to login page
    }
    )
  }
  else{
    alert('Invalid forms')
  }

    
  }
}
