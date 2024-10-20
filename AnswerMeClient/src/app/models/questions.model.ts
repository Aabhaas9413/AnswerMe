export interface Question {
    _recordId: number;          
    companyName: string;        
    _companyId: number;         
    question: string;           
    answer: string;             
    createdAt: Date;          
    createdBy: string;          
    updatedAt: Date;          
    updatedBy: string;          
    assignedTo?: string | null; 
    properties: { [key: string]: string }; 
    questionDescription: string; 
  }