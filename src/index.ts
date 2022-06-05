import {server} from './server';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.listen(4000, '0.0.0.0').then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});

