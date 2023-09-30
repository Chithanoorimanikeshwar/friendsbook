import { DateObjectPipe } from './date-object.pipe';

describe('DateObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new DateObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
