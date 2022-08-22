import React from 'react';
import { InputAdornment } from '@material-ui/core';

import PropTypes from 'prop-types';
import ColorPickerField from '../../uiComponent/formField/ColorPickerField';
import SelectField from '../../uiComponent/formField/SelectField';
import TextField from '../../uiComponent/formField/TextField';
import { hexToRgba ,getIndexForColor} from '../../utils/helper';
import { chartColorsPallet } from '../../theme/colorPalette';
import { required, validateWidth } from '../../utils/validators';
import FieldContainer from '../../uiComponent/formField/FieldContainer';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

const seriesStyleConfig = {
  COLOR: 'color',
  SERIES_TYPE: 'seriesType',
  SERIES_WIDTH: 'seriesWidth',
};

const seriesTypeOptions = [
  { value: 'solid', displayName: 'Solid' },
  { value: 'dot', displayName: 'Dot' },
  { value: 'dash', displayName: 'Dash' },
  { value: 'longdash', displayName: 'Long Dash' },
  { value: 'dashdot', displayName: 'Dash Dot' },
  { value: 'longdashdot', displayName: 'Long Dash Dot' },
];

function LineStyleConfig({ name, seriesName, index }) {
  const defaultColor = hexToRgba(chartColorsPallet[2][getIndexForColor(index,chartColorsPallet[2].length)]);
  return (
    <FieldsContainer>
      <FieldContainer title={`Series name: ${seriesName}`} />
      <FieldContainer>
        <ColorPickerField name={`${name}.${seriesStyleConfig.COLOR}`} defaultValue={defaultColor} />
      </FieldContainer>
      <FieldContainer title="Line Style">
        <SelectField
          label="Select line type"
          name={`${name}.${seriesStyleConfig.SERIES_TYPE}`}
          options={seriesTypeOptions}
          id="series-type"
          defaultValue="dot"
          validate={required}
        />
      </FieldContainer>
      <FieldContainer title="Line Thickness">
        <TextField
          name={`${name}.${seriesStyleConfig.SERIES_WIDTH}`}
          dataTestId="series-width"
          type="number"
          label="Enter line thickness"
          defaultValue="1"
          InputProps={{ endAdornment: <InputAdornment position="end">Px</InputAdornment> }}
          validate={validateWidth}
        />
      </FieldContainer>
    </FieldsContainer>
  );
}

LineStyleConfig.defaultProps = {
  index: 0,
  seriesName: '',
};

LineStyleConfig.propTypes = {
  name: PropTypes.string.isRequired,
  seriesName: PropTypes.string,
  index: PropTypes.number,
};

export default LineStyleConfig;
