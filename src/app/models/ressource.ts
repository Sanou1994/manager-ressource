interface ressource
 {
     id:any,
     category:any,
     categoryID?:any,
     description: string, 
     marque?: string,
     count:number,
     currentCount:number,
     demandCount:number,
     reservationTotalCount?:number,
     paidByHours?:boolean;
     paidByDays?:boolean;
     paidByGroups?:boolean;
     countByGroups?:number,
     unpaid?:boolean;
     mount:number,
     status:boolean,
     temporaly:boolean,
     programmable:boolean,
     plannings?:planning[],
     definitely:boolean | false,
     createdOn:any,
     updatedOn:any
     
  }

 