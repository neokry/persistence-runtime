import { DataSource, LocalDataSource, RuntimeDataSource } from './data';

export type TokenResult = {
  data?: any;
  error?: string;
};

(window as any).ps = (window as any).ps || {};

export class Runtime {
  version: string = '0.0.1';
  dataSource: DataSource;

  // TokenId -> TokenData
  values: {
    [tokenId: string]: any;
  } = {};

  constructor(props?: { local: boolean }) {
    if (props?.local) this.dataSource = new LocalDataSource();
    else this.dataSource = new RuntimeDataSource();
  }

  init() {
    const userData = this.dataSource.getUserData();
    if (!userData) return;

    const errors: Error[] = [];
    const tokenIds: string[] = [];

    Object.keys(userData).map((tokenId) => {
      try {
        const rawData = userData[tokenId];
        const decoded = this.decode(rawData);
        this.mutateToken({ tokenId, data: JSON.parse(decoded) });
        tokenIds.push(tokenId);
      } catch (err: any) {
        errors.push(err);
      }
    });

    return { tokenIds, errors };
  }

  getToken({ tokenId }: { tokenId?: string }): TokenResult {
    try {
      const tokenIdParsed = tokenId || (window as any).ps.tokenId;
      if (!tokenIdParsed) throw new Error('TokenId is required');
      let tokenData = this.values[tokenIdParsed];
      return { data: tokenData };
    } catch (err: any) {
      return { error: err };
    }
  }

  mutateToken({ tokenId, data }: { tokenId?: string; data: any }): TokenResult {
    try {
      const tokenIdParsed = tokenId || (window as any).ps.tokenId;
      if (!tokenIdParsed) throw new Error('TokenId is required');
      this.values[tokenIdParsed] = data;
      return { data };
    } catch (err: any) {
      return { error: err };
    }
  }

  commitToken({ tokenId }: { tokenId?: string }) {
    const tokenIdParsed = tokenId || (window as any).ps.tokenId;

    if (!tokenIdParsed) throw new Error('TokenId is required');
    const tokenData = this.values[tokenIdParsed];

    console.log('pressed', tokenData);

    const message = { tokenId: tokenIdParsed, data: JSON.stringify(tokenData) };
    this.dataSource.setUserData(message);
  }

  private decode(data: string) {
    return atob(data);
  }
}

if (!(window as any).rt) (window as any).rt = new Runtime();
