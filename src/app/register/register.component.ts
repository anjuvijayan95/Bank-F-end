import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm=this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
     uname:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]],
     pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]]
  })
constructor(private fb:FormBuilder, private regApiCall:ApiService, private router:Router){}

register(){
  if(this.registerForm.valid){
    // alert('yes here your registered')
  let acno=this.registerForm.value.acno
  let pswd=this.registerForm.value.pswd
  let uname=this.registerForm.value.uname
  
//we want to post it after validation that's why we give it inside if condition
//the argument
  this.regApiCall.register(uname,acno,pswd)
  .subscribe((result:any)=>{
    alert(result.message)
    
  },
  //client error
  (result:any)=>{
    alert(result.error.message)
    //navigate to login page
    this.router.navigateByUrl(' ')
  }
  )

}
else{
  alert('invalid forms')
}
}



}

