import uniqKeyGenerator from '../uniqKeyGenerator';

describe('uniqKeyGenerator', () => {
  const mockDate = 1466424490000;
  const mockRandom = 0.1;

  it('should generate uniq key', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    jest.spyOn(Math, 'random').mockImplementation(() => mockRandom);
    expect(uniqKeyGenerator()).toEqual(`${mockDate}${mockRandom}`);
    jest.restoreAllMocks();
  });
});
