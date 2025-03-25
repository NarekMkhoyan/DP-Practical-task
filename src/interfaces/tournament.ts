import {
  calculateRounds,
  pickAWinner,
  removeAndReturnRandomElements,
} from 'src/utils/helper';
import { IMembersResponseData } from './members-response.interface';

interface ITournament {
  maxRoundCount: number;
  currentRound: number;
  bracket: BracketSection;
}

export class Tournament implements ITournament {
  maxRoundCount;
  currentRound = 1;
  bracket = new BracketSection();
  private members: IMembersResponseData[] = [];

  constructor(members: IMembersResponseData[]) {
    this.members = [...members];
    this.maxRoundCount = calculateRounds(members.length);
    this.populateBracketSides(members);
  }

  public play(): void {
    if (this.currentRound === this.maxRoundCount) {
      confirm(
        `And the winner is ${pickAWinner(this.bracket.members).team_name}`
      );
      this.reset();
    } else {
      this.recursiveChildNodePlay(this.bracket.childNodes, this.bracket);
      this.currentRound = this.currentRound + 1;
    }
  }

  private reset(): void {
    this.currentRound = 1;
    this.bracket = new BracketSection();
    this.maxRoundCount = calculateRounds(this.members.length);
    this.populateBracketSides([...this.members]);
  }

  private recursiveChildNodePlay(
    childNodes: BracketSection[],
    bracket: BracketSection
  ): void {
    childNodes.forEach((node) => {
      if (node.round === this.currentRound) {
        const winner = node.play();
        bracket.members.push(winner);
      } else if (node.childNodes.length) {
        this.recursiveChildNodePlay(node.childNodes, node);
      }
    });
  }

  private populateBracketSides(members: IMembersResponseData[]): void {
    this.bracket.createChildNodes(this.maxRoundCount, [...members]);
  }
}

export class BracketSection {
  members: IMembersResponseData[] = [];
  childNodes: BracketSection[] = [];
  round: number = 1;

  createChildNodes(
    maxNumberOfLevels: number,
    members: IMembersResponseData[]
  ): this {
    this.setRoundNumber(maxNumberOfLevels);
    if (maxNumberOfLevels === 1) {
      this.members = removeAndReturnRandomElements<IMembersResponseData>(
        members,
        2
      );
    }
    if (maxNumberOfLevels !== 1) {
      this.childNodes = [
        new BracketSection().createChildNodes(maxNumberOfLevels - 1, members),
        new BracketSection().createChildNodes(maxNumberOfLevels - 1, members),
      ];
    }
    return this;
  }

  play(): IMembersResponseData {
    return pickAWinner(this.members);
  }

  private setRoundNumber(roundNumber: number): this {
    this.round = roundNumber;
    return this;
  }
}
