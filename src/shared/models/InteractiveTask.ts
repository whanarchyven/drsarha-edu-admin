
import type {TaskDifficultyType} from "./types/TaskDifficultyType.ts";
import type {FeedBackQuestions} from "./types/FeedBackQuestions.ts";


export interface InteractiveTask {
    _id?: string;
    name:string;
    difficulty:number;
    cover_image:string;
    answers:{
        image:string;
        answer:string
    }[]
    difficulty_type:TaskDifficultyType;
    available_errors:number;
    feedback:FeedBackQuestions;
    nozology:string;
    stars:number;   
}
