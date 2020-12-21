import uniqKeyGenerator from "../uniqKeyGenerator";

describe("uniqKeyGenerator",()=>{
    const mockDate = 1466424490000
    const mockRandom = 0.1

    let dateSpy;
    let mathSpy;

    beforeAll(() => {

        dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate)
        mathSpy = jest.spyOn(Math, 'random').mockImplementation(() => mockRandom)
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
    it("should generate uniq key",()=>{

        expect(uniqKeyGenerator()).toEqual(`${mockDate}${mockRandom}`)
    })
})