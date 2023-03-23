import { Runtime } from 'runtime_script';
import * as _ from 'p5/global';
var tokenId: string | undefined;

let userInput: any;

const getRuntime = (): Runtime | undefined => {
  return (window as any).rt;
};

const getCurrentToken = () => {
  return typeof tokenId !== 'undefined' ? tokenId : '0';
};

function setup() {
  const rt = getRuntime();
  let currentToken = getCurrentToken();

  userInput = createInput('');
  userInput.position(5, 10);
  userInput.size(100);

  loadInitalData();

  let button = createButton('submit');
  button.position(5, 35);
  button.mousePressed(() => {
    rt?.mutateToken({
      tokenId: currentToken,
      data: {
        user: userInput.value(),
      },
    });

    rt?.commitToken({ tokenId: currentToken });
  });
}

const loadInitalData = async () => {
  const rt = getRuntime();
  const res = await rt?.init();
  console.log('initRes', res);

  let currentToken = getCurrentToken();

  const { user } = rt?.getToken({ tokenId: currentToken }).data || {};
  console.log('initalValue', user);
  if (user) userInput.value(user);
};
