import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options={
  headers:new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl:string=''
  constructor(private http:HttpClient) { }

  //function for register
  register(uname:any, acno:any, pswd:any){
    // here in array we are not giving it as a key value pair because we are saving
    //  eg:- uname as value also ie here they consider as,uname:uname
    const body={
      uname,
      acno,
      pswd
    }
    //api call for register items
    return this.http.post('http://localhost:3000/register',body)
  }

  login(acno:any,pswd:any){
    const body={
      acno,
      pswd
    }
    return this.http.post('http://localhost:3000/login',body)
  }


  //appending token to http header
  appendToken(){
      //fetch token from local storage
      const token= localStorage.getItem('token')||''
      //create http header
      var headers = new HttpHeaders()
      if(token){
      //append token inside http headers
      headers=headers.append('access-token',token)
      options.headers=headers
    }
      return options
  

  }

  //api call fun for get balance from backend
  getBalance(acno:any){
    //here we are giving acno as this url's path parameter
    return this.http.get('http://localhost:3000/getBalance/'+acno,this.appendToken())
  }

  credit(acno:any,amount:any){
    const body={
      acno,
      amount
    }
    return this.http.post('http://localhost:3000/credit',body,this.appendToken())
  }


  transfer(toAcno:any,amount:any,pswd:any){
    const body={
      toAcno,
      amount,
      pswd
    }
    return this.http.post('http://localhost:3000/fundTransfer',body,this.appendToken())
  }

//api call for transaction history
trasactionHistory(){
    return this.http.get('http://localhost:3000/history',this.appendToken())
  }
  // delete account
  deleteAccount(acno:Number){
    return this.http.delete('http://localhost:3000/deleteAcno/'+acno,this.appendToken())
  }
}


