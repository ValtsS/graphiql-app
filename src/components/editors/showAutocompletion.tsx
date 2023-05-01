function autocomplete(monaco, obj) {
  function getType(maybe, isMember) {
    switch ((typeof maybe).toLowerCase()) {
      case 'object':
        return monaco.languages.CompletionItemKind.Class;

      default:
        return isMember
          ? monaco.languages.CompletionItemKind.Property
          : monaco.languages.CompletionItemKind.Variable;
    }
  }

  monaco.languages.registerCompletionItemProvider('graphql', {
    triggerCharacters: ['.', '{'],

    provideCompletionItems: function (model, position) {
      const lastChars = model.getValueInRange({
        startLineNumber: 0,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const words = lastChars.replace('\t', '').split('{');
      const activeTyping = words[words.length - 1];
      const result = [];

      let lastToken = obj;
      let prefix = '';

      if (words.length > 1) {
        lastToken = obj[words[0]];
        prefix = words[0];

        if (!lastToken) {
          // console.log('Error');
          // const markers = [
          //   {
          //     severity: monaco.MarkerSeverity.Error,
          //     startLineNumber: position.lineNumber,
          //     startColumn: position.lineNumber,
          //     endLineNumber: position.lineNumber,
          //     endColumn: position.column,
          //     message: 'hi there',
          //   },
          // ];

          // monaco.editor.setModelMarkers(model, 'graphql', markers);
          return;
        }
      }

      for (const prop in lastToken) {
        if (lastToken.hasOwnProperty(prop)) {
          const toPush = {
            label: prop,
            kind: getType(lastToken[prop], true),
            insertText: prop,
            documentation: {
              value: '',
            },
          };
          result.push(toPush);
        }
      }

      return {
        suggestions: result,
      };
    },
  });
}

export default autocomplete;
