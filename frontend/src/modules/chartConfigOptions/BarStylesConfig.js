import React from 'react';
import PropTypes from 'prop-types';

import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import { chartColorsPallet } from '../../theme/colorPalette';
import {getIndexForColor, hexToRgba} from '../../utils/helper';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

const seriesStyleConfig = {
  COLOR: 'color',
};

function BarStyleConfig({ name, seriesName, index }) {
    const defaultColor = hexToRgba(chartColorsPallet[2][getIndexForColor(index,chartColorsPallet[2].length)]);
  return (
    <>
      <FieldContainer title={`Series name: ${seriesName}`} />
      <FieldContainer>
        <ColorPickerField name={`${name}.${seriesStyleConfig.COLOR}`} defaultValue={defaultColor} />
      </FieldContainer>
    </>
  );
}

BarStyleConfig.defaultProps = {
  index: 0,
};

BarStyleConfig.propTypes = {
  name: PropTypes.string.isRequired,
  seriesName: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default BarStyleConfig;
