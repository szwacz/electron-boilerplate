import { expect } from 'chai';
import { greet, bye } from './hello_world';
import env from '../env';

describe('hello world', () => {
  it('greets', () => {
    expect(greet()).to.equal('Hello World!');
  });

  it('says goodbye', () => {
    expect(bye()).to.equal('See ya!');
  });

  it('should load test environment variables', () => {
    expect(env.name).to.equal('test');
    expect(env.description).to.equal('Add here any environment specific stuff you like.');
  });
});
