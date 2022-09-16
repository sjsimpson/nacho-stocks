interface User {
  id: string;
  username: string;
  password: string;

  cashAccountValue: number;
  totalAssetValue: number;
  portfolioValue: number;

  stockPositions: StockPosition[];

  // constructor(username: string, password: string) {
  //   this.username = username;
  //   this.password = password;
  // }


}

interface StockPosition {
  stockId: string; // stock ticker
  purchasePrice: number;
  numberOfShares: number;
}
