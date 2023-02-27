import * as P5 from 'p5';
import { Runtime } from 'runtime_script';
import 'runtime_script';

const rt = (window as any).rt as Runtime;

console.log('rt', rt);

const sketch = (p5: P5) => {
  p5.setup = () => {
    rt.init();

    const canvas = p5.createCanvas(200, 200);
    canvas.parent('app');

    p5.background('white');

    let inp = p5.createInput('');
    inp.position(5, 10);
    inp.size(100);

    const initalValue = rt.getToken({ tokenId: '1' }).data;
    console.log('initalValue', initalValue);
    if (initalValue) inp.value(initalValue);

    let button = p5.createButton('submit');
    button.position(5, 35);
    button.mousePressed(() => {
      rt.mutateToken({
        tokenId: '1',
        data: inp.value(),
      });

      rt.commitToken({ tokenId: '1' });
    });
  };
};

const setInitalState = () => {
  let pattern = {
    beatButtons: [
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
    ],
    sliders: [
      [
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9],
      ],
      [
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.4, 0.5, 0.6, 0.4, 0.7, 0.5, 0.6],
      ],
      [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2],
      ],
      [
        [0.4, 0.4, 0.4, 0.7, 0.7, 0.7, 0.2],
        [0.2, 0.6, 0.2, 0.6, 0.8, 0.2, 0.3],
      ],
    ],
    tempo: 400,
  };

  rt.mutateToken({
    tokenId: '1',
    data: pattern,
  });

  rt.commitToken({ tokenId: '1' });
};

new P5(sketch);
