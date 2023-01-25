import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService} from '../service/api.service';
import party from "party-js";
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit{
  user:string=''
  currentAcno:Number=0
  isCollapse:boolean=true 
  balance:Number=0 
  creditMsg:string=''
  fundTansferSuccessMsg:string=''
  fundTansferErrorMsg:string=''
  type:string=''
  history:any
  searchKey:string=''
  logoutDiv:boolean=false
  acno:any=''
  deleteConfirm:boolean=false
  deleteSpinnerDiv:boolean=false

  creditForm=this.fb.group({
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
  })

  transactionForm=this.fb.group({
    toAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]]
  })

  constructor(private apiCall:ApiService,private fb:FormBuilder,private route:Router){}

ngOnInit(): void {
  //to check account holder is already login or not
  if(!localStorage.getItem("token")){
    alert('please login')
    this.route.navigateByUrl('')
  }
  if(localStorage.getItem("username")){
    this.user= localStorage.getItem("username")||''
}
if(localStorage.getItem("currentAcno")){
  this.currentAcno=JSON.parse(localStorage.getItem("currentAcno")||'')
}
}


//button function
collapse(){
  this.isCollapse=!this.isCollapse
}

//to get balance
getBalance(){
  this.apiCall.getBalance(this.currentAcno)
  .subscribe((result:any)=>{
    console.log(result);
    this.balance=result.balance
    
  })
}

//function for credit amount
creditFun(){
  if(this.creditForm.valid){
    // alert('your amount credited')
   let amount=this.creditForm.value.amount
   this.currentAcno=JSON.parse(localStorage.getItem("currentAcno")||'')
    this.apiCall.credit(this.currentAcno,amount)
    .subscribe(
      //success
      (result:any)=>{
      console.log(result);
      this.creditMsg=result.message
      
      setTimeout(()=>{
        this.creditForm.reset()
        this.creditMsg=''
      },5000)
      },
      //error
      (result:any)=>{
        this.creditMsg=result.error.message
      }
      )
}
  else{
    alert('invalid form')
  }
}

showconfetti(source:any){
  party.confetti(source);
}

//Function for transaction to checking is validation crt and to get response from b:end through apiService
transaction(){
  if(this.transactionForm.valid){
    // alert('yes its transfered')
    let toAcno=this.transactionForm.value.toAcno
    let amount=this.transactionForm.value.amount
    let pswd=this.transactionForm.value.pswd

    this.apiCall.transfer(toAcno,amount,pswd)
    .subscribe((result:any)=>{
      // console.log(result);
      this.fundTansferSuccessMsg=result.message
      setTimeout(()=>{
        this.transactionForm.reset()
        this.fundTansferSuccessMsg=''
      },5000)
    },
    (result:any)=>{
      this.fundTansferErrorMsg=result.error.message
    }
    )

  }
  // else{
  //   alert('invalid form')
  // }
}

//clear fund transfer form

clearfundTransferForm(){
  this.fundTansferSuccessMsg=''
  this.fundTansferErrorMsg=''
  this.transactionForm.reset()
  }

//transaction history

trasactionHistory(){
  this.apiCall.trasactionHistory()
  .subscribe((result:any)=>{
    this.history=result.transaction
    console.log(this.history);
    
  })
}


  //search
  search(event:any){
    // console.log(event.target.value);
    this.searchKey=event.target.value
    
  }

  //to create pdf
  generatePdf(){
    var pdf= new jspdf()
    let col=['Mode','From Account','To Account','Amount']
    let row:any=[]
    pdf.setFontSize(16);
    pdf.text('Transaction History', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    //convert array of obj to nested array
    var item = this.history
    // item.forEach((element)=>{
      
    //   var converter=[
    //     element.type,
    //     element.fromAcno,
    //     element.toAcno,
    //     element.amount
    //   ]
    //   row.push(converter)
    //   console.log(row);
      
    // })

    for(let element of item){
      var converter=[
        element.type,
        element.fromAcno,
        element.toAcno,
        element.amount
      ]
      row.push(converter)
    }

    (pdf as any).autoTable(col,row,{startY:10})
    
    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    pdf.save('TransactionHistory.pdf');
  }


  //function for logout
  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("currentAcno")
    this.logoutDiv=true
    setTimeout(()=>{
      this.route.navigateByUrl('')
      this.logoutDiv=false
    },2000)
  }


  //delete Account from navbar
  deleteAccountFromNavbar(){
    this.acno=localStorage.getItem("currentAcno")
    this.deleteConfirm=true;
  }

  onCancel(){
    this.acno=''
    this.deleteConfirm=false
  }

  onDelete(event:any){
    let deleteAcno=JSON.parse(event)
    this.apiCall.deleteAccount(deleteAcno)
    .subscribe(
      (result:any)=>{
      this.acno=""
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("currentAcno")
      this.deleteSpinnerDiv=true

      setTimeout(()=>{
        this.route.navigateByUrl('')
        this.deleteSpinnerDiv=false
      },3000);
    },
    (result:any)=>{
      alert(result.error.message)
    }
    )
  }
}

