interface User
 {    
    id:any;
    lastname:string;
    firstname:string;
    adress:string;
    email:string;
    password:string;
    phone:string;
    status:boolean;
    role:string;
    createdOn:any;
    updatedOn:any;
  }
  interface UserDto
  {    
     id:any;
     lastname:string;
     firstname:string;
     adress:string;
     email:string;
     password:string;
     phone:string;
     status:boolean;
     role:string;
     lock:string;
     icon:string;
     lockLabel:string;
     enabled:string;
     color:string;
     createdOn:any;
     updatedOn:any;
   }

  interface SearchUser {
    
    id:any;
    lastname:string;
    firstname:string;
    adress:string;
    email:string;
    password:string;
    page:number;
    size:number;
    phone:string;
    status:boolean;
    role:string;
  }
  interface ChangePassword {
    id :any;
	  oldPassword:string;
	  newPassword:string
    
  }