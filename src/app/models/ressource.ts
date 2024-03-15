interface ressource
 {
     id:any,
     category:any,
     description: string, 
     marque?: string,
     count:number,
     currentCount:number,
     demandCount:number,
     reservationTotalCount?:number,
     mount:number,
     status:boolean,
     temporaly:boolean,
     programmable:boolean,
     plannings?:planning[],
     definitely:boolean | false,
     createdOn:any,
     updatedOn:any
     
  }

 