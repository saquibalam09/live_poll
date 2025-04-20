export interface VoteCount {
  cats: number;
  dogs: number;
}

export interface JoinSuccessPayload {
  users: string[]; // usernames of all users in the room
  roomCode: string; // room code
  question: string;
  votes: VoteCount;
  hasEnded: boolean;
  endsAt: number; // in milliseconds
  createdBy: string; // username of the creator
}
