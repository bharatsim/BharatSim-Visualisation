function isEven(index) {
  return index % 2;
}

function isLastRow(index, dataLength) {
  return index === dataLength - 1;
}

function tableStyles(theme, data) {
  const rowStyles = (index) => ({
    height: theme.spacing(8),
    backgroundColor: isEven(index) ? theme.colors.primaryColorScale[50] : 'transparent',
    borderBottom: `${
      isLastRow(index, data.length)
        ? 'unset'
        : `1px solid ${theme.colors.primaryColorScale['500']}3D`
    }`,
  });

  const cellStyle = () => ({
    height: theme.spacing(8),
    padding: theme.spacing(2, 3),
    textAlign: 'left',
    ...theme.typography.body2,
    lineHeight: 1,
    border: 'unset',
  });

  const headerStyle = {
    padding: theme.spacing(2, 3),
    textAlign: 'left',
    flexDirection: 'row',
    ...theme.typography.subtitle1,
    lineHeight: 1.25,
  };

  const styles = {
    boxShadow: 'none',
    border: '1px solid',
    borderColor: `${theme.colors.primaryColorScale['500']}3D`,
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
  };

  return { styles, rowStyles, cellStyle, headerStyle };
}

export default tableStyles;
