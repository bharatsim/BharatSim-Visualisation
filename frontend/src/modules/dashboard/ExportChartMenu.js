import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core';
import { GetAppOutlined, PhotoCamera } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { toPng, toSvg } from 'html-to-image';
import DropdownMenu from '../../uiComponent/dropdownMenu/DropdownMenu';
import IconButton from '../../uiComponent/IconButton';

const iconStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
}));
function ExportChartMenu({ element, title }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const iconClasses = iconStyles();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  function onMenuClick(handler) {
    return () => {
      closeMenu();
      handler();
    };
  }
  function exportToSVG() {
    toSvg(element, {
      quality: 1,
      pixelRatio: 1,
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = title;
      link.href = dataUrl;
      link.click();
    });
  }

  function exportToPNG() {
    toPng(element, {
      quality: 1,
      pixelRatio: 1,
      canvasWidth: element?.offsetWidth * 5,
      canvasHeight: element?.offsetHeight * 5,
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = title;
      link.href = dataUrl;
      link.click();
    });
  }

  return (
    <>
      <IconButton
        data-testid="export-image-menu"
        disableRipple
        onClick={openMenu}
        classes={iconClasses}
        title="Export to image"
      >
        <PhotoCamera fontSize="small" htmlColor={theme.colors.grayScale['500']} />
      </IconButton>
      <DropdownMenu
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        menuItems={[
          {
            label: 'Export to SVG',
            dataTestId: 'exportToSVG',
            onClick: onMenuClick(exportToSVG),
            icon: <GetAppOutlined />,
          },
          {
            label: 'Export to PNG',
            dataTestId: 'exportToPNG',
            onClick: onMenuClick(exportToPNG),
            icon: <GetAppOutlined />,
            withDivider: true,
          },
        ]}
      />
    </>
  );
}

ExportChartMenu.defaultProps = {
  element: null,
};

ExportChartMenu.propTypes = {
  element: PropTypes.instanceOf(Element),
  title: PropTypes.string.isRequired,
};

export default ExportChartMenu;
