// export const languages = {
//   json: {
//     jsonDefaults: {
//       setDiagnosticsOptions: function () {},
//     },
//   },
//   editor: {
//     defineTheme: function () {},
//   },
// };
// export const KeyMod = { CtrlCmd: '' };
// export const KeyCode = { Enter: '' };

module.exports = {
  KeyMod: { CtrlCmd: '' },
  KeyCode: { Enter: '' },
  languages: {
    json: {
      jsonDefaults: {
        setDiagnosticsOptions: jest.fn(),
      },
    },
  },
  editor: {
    defineTheme: jest.fn(),
  },
};

console.log('aaaa!!!!!!!!');
