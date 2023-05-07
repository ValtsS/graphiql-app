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
    create: jest.fn(),
    getModel: jest.fn(),
    createModel: jest.fn().mockReturnValue({
      onDidChangeContent: jest.fn(),
    }),
  },
  Uri: {
    file: jest.fn(),
  },
};
