export interface Character {
  name: string;
  status: Status;
  species: string;
  gender: Gender;
  image: string;
  origin: {
    name: string;
    url: string;
  };
  episode: string[];
}
  
export enum Status {
  Alive = "Alive",
  Dead = "Dead",
  Unknown = "unknown",
}
  
export enum Gender {
  Male = "Male",
  Female = "Female",
  Unknown = "unknown",
  Genderless = "Genderless",
}
  