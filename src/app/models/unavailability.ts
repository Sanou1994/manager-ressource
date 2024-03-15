interface unavailability
 {
     id:any,
     type_of_ressource:string,
     ressourceID: any, 
     mount:number,
     description:string,
     status:boolean,
     etat?:restitutionEnumString | restitutionEnumString.NON_RESTITUTION ;
     count:number | 0,
     date_restitution?:number | 0;
     count_given?:number,
     date_taken:any,
     date_given:any,
     taker_fullname?:string,
     takerIdentificant:string,
     taker_signature:string,
     createdOn:any,
     updatedOn:any
     
  }
  interface unavailabilityDto
  {
      id:any,
      type_of_ressource:string,
      ressourceID: any, 
      mount:number,
      description:string,
      status:boolean,
      etat?:string;
      color:string,
      close:boolean,
      count?:number,
      date_restitution?:number | 0;
      count_given?:number,
      date_taken:any,
      date_given:any,
      taker_fullname?:string,
      takerIdentificant:string,
      taker_signature:string,
      createdOn:any,
      updatedOn:any
      
   }

 enum restitutionEnumString {
    PARTIEL_RESTITUTION="PARTIEL_RESTITUTION",
    NON_RESTITUTION="NON_RESTITUTION",
    TOTAL_RESTITUTION="TOTAL_RESTITUTION"
}


enum restitutionEnum {
    PARTIEL_RESTITUTION,
    NON_RESTITUTION,
    TOTAL_RESTITUTION
}
  
 