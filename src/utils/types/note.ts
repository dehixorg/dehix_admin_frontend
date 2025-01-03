export type Note = {
    id: string;
    title: string;
    content: string;
    color?: string;
    banner?: string;
    createdAt: Date;
    isHTML:boolean,
    entityID?: string;   
    entityType?:string;
    type?: "personal" | "work" | "reminder" | "task";
  };
  
  
  //entityID , type
  // business , freelancer , transaction , projects,bid,interview , dehix talent