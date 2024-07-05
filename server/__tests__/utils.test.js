const { convertToIdArr } = require("../utils/utils");

describe("convertToIdArr()", () => {
  test("should return an empty array when passed any data type that is not an array as an argument", () => {
    const inputStr = "";
    const inputNum = 1;
    const inputBool = true;
    const inputUndefined = undefined;
    const inputNull = null;
    const inputObj = {};
    const inputNaN = NaN;

    expect(convertToIdArr(inputStr)).toEqual([]);
    expect(convertToIdArr(inputNum)).toEqual([]);
    expect(convertToIdArr(inputBool)).toEqual([]);
    expect(convertToIdArr(inputUndefined)).toEqual([]);
    expect(convertToIdArr(inputNull)).toEqual([]);
    expect(convertToIdArr(inputObj)).toEqual([]);
    expect(convertToIdArr(inputNaN)).toEqual([]);
  });
  test("should return an empty array if passed more than one argument", () => {
    const inputArr = [
      { _id: "6685484eb3b5bf698cc8c252" },
      { _id: "6685484eb3b5bf698cc8c254" },
      { _id: "6685484eb3b5bf698cc8c256" },
      { _id: "6685484eb3b5bf698cc8c257" },
      { _id: "6685484eb3b5bf698cc8c258" },
      { _id: "6685484eb3b5bf698cc8c259" },
      { _id: "6685484eb3b5bf698cc8c25a" },
      { _id: "6685484eb3b5bf698cc8c25b" },
      { _id: "6685484eb3b5bf698cc8c25e" },
      { _id: "6685484eb3b5bf698cc8c25f" },
    ];

    const output = convertToIdArr(inputArr, "");

    expect(output).toEqual([]);
  });
  test("should return a new array", () => {
    const inputArr = [
      { _id: "6685484eb3b5bf698cc8c252" },
      { _id: "6685484eb3b5bf698cc8c254" },
      { _id: "6685484eb3b5bf698cc8c256" },
      { _id: "6685484eb3b5bf698cc8c257" },
      { _id: "6685484eb3b5bf698cc8c258" },
      { _id: "6685484eb3b5bf698cc8c259" },
      { _id: "6685484eb3b5bf698cc8c25a" },
      { _id: "6685484eb3b5bf698cc8c25b" },
      { _id: "6685484eb3b5bf698cc8c25e" },
      { _id: "6685484eb3b5bf698cc8c25f" },
    ];

    expect(inputArr).not.toBe(convertToIdArr(inputArr));
  });

  test("should not mutate the original array", () => {
    const inputArr = [
      { _id: "6685484eb3b5bf698cc8c252" },
      { _id: "6685484eb3b5bf698cc8c254" },
      { _id: "6685484eb3b5bf698cc8c256" },
      { _id: "6685484eb3b5bf698cc8c257" },
      { _id: "6685484eb3b5bf698cc8c258" },
      { _id: "6685484eb3b5bf698cc8c259" },
      { _id: "6685484eb3b5bf698cc8c25a" },
      { _id: "6685484eb3b5bf698cc8c25b" },
      { _id: "6685484eb3b5bf698cc8c25e" },
      { _id: "6685484eb3b5bf698cc8c25f" },
    ];
    const copyInputArr = [
      { _id: "6685484eb3b5bf698cc8c252" },
      { _id: "6685484eb3b5bf698cc8c254" },
      { _id: "6685484eb3b5bf698cc8c256" },
      { _id: "6685484eb3b5bf698cc8c257" },
      { _id: "6685484eb3b5bf698cc8c258" },
      { _id: "6685484eb3b5bf698cc8c259" },
      { _id: "6685484eb3b5bf698cc8c25a" },
      { _id: "6685484eb3b5bf698cc8c25b" },
      { _id: "6685484eb3b5bf698cc8c25e" },
      { _id: "6685484eb3b5bf698cc8c25f" },
    ];

    convertToIdArr(inputArr);

    expect(inputArr).toEqual(copyInputArr);
  });
});
