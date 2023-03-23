import { DataSource, LocalDataSource, RuntimeDataSource } from './data';

export type TokenResult = {
  data?: any;
  error?: string;
};

(window as any).ps = (window as any).ps || {};

export class Runtime {
  version: string = '0.0.1';
  dataSource: DataSource;
  initialized = false;

  // TokenId -> TokenData
  values: {
    [tokenId: string]: any;
  } = {};

  constructor(props?: { local: boolean }) {
    if (props?.local) this.dataSource = new LocalDataSource();
    else this.dataSource = new RuntimeDataSource();
  }

  async init(props?: { parseJSON: boolean }) {
    const { parseJSON } = props || { parseJSON: true };
    this.initialized = true;

    const userData = this.dataSource.getUserData();
    if (!userData) return;

    const errors: Error[] = [];
    const tokenIds: string[] = [];

    await Promise.all(
      Object.keys(userData).map(async (tokenId) => {
        try {
          const rawData = userData[tokenId];
          const decoded = await this.decode(rawData);
          const parsed = parseJSON === true ? JSON.parse(decoded) : decoded;

          this.mutateToken({ tokenId, data: parsed });
          tokenIds.push(tokenId);
        } catch (err: any) {
          errors.push(err);
        }
      })
    );

    return { tokenIds, errors };
  }

  getToken({ tokenId }: { tokenId?: string }): TokenResult {
    if (!this.initialized) throw new Error('Runtime is not initialized');
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
    if (!this.initialized) throw new Error('Runtime is not initialized');
    try {
      const tokenIdParsed = tokenId || (window as any).ps.tokenId;
      if (!tokenIdParsed) throw new Error('TokenId is required');
      this.values[tokenIdParsed] = data;
      return { data };
    } catch (err: any) {
      return { error: err };
    }
  }

  commitToken({
    tokenId,
    encodeJSON = true,
  }: {
    tokenId?: string;
    encodeJSON?: boolean;
  }) {
    if (!this.initialized) throw new Error('Runtime is not initialized');
    const tokenIdParsed = tokenId || (window as any).ps.tokenId;

    if (!tokenIdParsed) throw new Error('TokenId is required');
    const tokenData = this.values[tokenIdParsed];

    const message = {
      tokenId: tokenIdParsed,
      data: encodeJSON ? JSON.stringify(tokenData) : tokenData,
    };
    this.dataSource.setUserData(message);
  }

  private decode(data: string) {
    return new Promise<string>((res, rej) => {
      try {
        res(atob(data));
      } catch (err) {
        rej(err);
      }
    });
  }
}

if (!(window as any).rt) (window as any).rt = new Runtime();
