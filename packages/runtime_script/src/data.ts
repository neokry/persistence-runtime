export interface DataSource {
  getUserData(): any;
  setUserData(data: SetUserDataProps): void;
}

export type SetUserDataProps = {
  tokenId: string;
  data: string;
};

export class LocalDataSource implements DataSource {
  getUserData() {
    let data = localStorage.getItem('__rt_user');
    return data ? JSON.parse(data) : undefined;
  }

  setUserData({ tokenId, data }: SetUserDataProps) {
    let currentData = this.getUserData();
    if (!currentData) currentData = {};

    currentData[tokenId] = btoa(data);

    localStorage.setItem('__rt_user', JSON.stringify(currentData));
  }
}

export class RuntimeDataSource implements DataSource {
  getUserData() {
    return (window as any).__rt_user;
  }

  setUserData(data: SetUserDataProps) {
    (window as any).__rt_message = data;
    if (window.parent) window.parent.postMessage(data, '*');
  }
}
