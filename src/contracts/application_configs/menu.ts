export class Menu {
  menuName: string;
  actions: Action[];
}
export class Action {
  actionType: string;
  httpType: string;
  definition: string;
  actionCode: string;
}
