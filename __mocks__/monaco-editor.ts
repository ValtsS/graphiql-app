const mockSchemaConfig = jest.fn();

class FakeModel {}

class FakeEditor {
  model: FakeModel = new FakeModel();
  public getModel() {
    return this.model;
  }
  public dispose() {}
  public setModel() {}
  public layout() {}
  public updateOptions() {}
}

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
    create: jest.fn().mockReturnValue(new FakeEditor()),
    getModel: jest.fn(),
    setModelLanguage: jest.fn(),
    createModel: jest.fn().mockReturnValue({
      onDidChangeContent: jest.fn(),
      setValue: jest.fn(),
      getValue: jest.fn(),
    }),
  },
  Uri: {
    file: jest.fn().mockImplementation((id) => id),
  },
  initializeMode: jest.fn().mockImplementation(() => {
    return {
      setSchemaConfig: mockSchemaConfig,
    };
  }),
};
