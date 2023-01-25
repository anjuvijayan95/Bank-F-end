import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(trasactionHistory:any [], searchKey:string,propertyName:string): any [] {
    const result:any= []
    if(!trasactionHistory || searchKey=='' || propertyName==''){
      return trasactionHistory;
  }

  trasactionHistory.forEach((hist:any)=>{
  if ( hist[propertyName].trim().toLowerCase().includes(searchKey.toLowerCase())){
    result.push(hist)
  }
  })
    return result;
  }

}
