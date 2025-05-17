export interface TheorySection {
    time: string;
    content: string;
    theory: {
      details: string;
      badge: string;
      points: number;
      tips: string[];
    };
  }
  
  export interface TheoryContent {
    title: string;
    duration: string;
    sections: TheorySection[];
    keyTopics: string[];
  }
  
  export interface TheoryResponse {
    content: string;
  }