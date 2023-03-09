import { Runtime } from 'runtime_script';
import * as _ from 'p5/global';
var tokenId: string | undefined;

let input: any;

const getRuntime = (): Runtime | undefined => {
  return (window as any).rt;
};

const getCurrentToken = () => {
  return typeof tokenId !== 'undefined' ? tokenId : '0';
};

function setup() {
  const rt = getRuntime();
  let currentToken = getCurrentToken();

  input = createInput('');
  input.position(5, 10);
  input.size(100);

  loadInitalData();

  let button = createButton('submit');
  button.position(5, 35);
  button.mousePressed(() => {
    rt?.mutateToken({
      tokenId: currentToken,
      data: input.value(),
    });

    rt?.commitToken({ tokenId: currentToken });
  });
}

const loadInitalData = async () => {
  const rt = getRuntime();
  await rt?.init();

  let currentToken = getCurrentToken();

  const initalValue = rt?.getToken({ tokenId: currentToken }).data;
  if (initalValue) input.value(initalValue);
};

setup();
