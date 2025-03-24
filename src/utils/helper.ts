import { IMembersResponseData } from 'src/interfaces/members-response.interface';

export function calculateRounds(playerCount: number): number {
  if (playerCount <= 0) {
    throw new Error('Player count must be a positive number');
  }

  return Math.ceil(Math.log2(playerCount));
}

export function pickAWinner(
  members: IMembersResponseData[]
): IMembersResponseData {
  const winnerIndex = Math.floor(Math.random() * 2);
  const winner = members[winnerIndex];
  return winner;
}
