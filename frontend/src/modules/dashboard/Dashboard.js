import Box from '@material-ui/core/Box';
import React, {useContext, useEffect, useState} from 'react';
import {fade, makeStyles} from '@material-ui/core';

import ReactGridLayout, {WidthProvider} from 'react-grid-layout';
import {projectLayoutContext} from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import {useDispatch} from "react-redux";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useModal from '../../hook/useModal';
import ChartConfigurationWizard from './chartConfigurationWizard/ChartConfigurationWizard';
import {getNewWidgetLayout} from '../../utils/dashboardLayoutUtils';
import CreateNewChartWidget from './CreateNewChartWidget';
import {renderWidget} from './renderWidget';
import {api} from '../../utils/api';
import useFetch from '../../hook/useFetch';
import snackbarVariant from '../../constants/snackbarVariant';
import {errors, errorTypes} from '../../constants/loaderAndErrorMessages';
import {overlayLoaderOrErrorContext} from '../../contexts/overlayLoaderOrErrorContext';
import DashboardHeader from './DashboardHeader';
import {enqueueSnackbar as enqueueSnackbarAction,} from '../../hoc/snackbar/snackBarActions'

const COLUMNS = 12;

const GridLayout = WidthProvider(ReactGridLayout);

const useStyles = makeStyles((theme) => {
    return {
        reactGridLayout: {
            background: theme.palette.background.default,
            minHeight: theme.spacing(75),
            '& .react-grid-item': {
                background: theme.palette.background.paper,
                border: '1px solid',
                borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
                borderRadius: theme.spacing(1),
            },
        },
        gridContainer: {
            height: `calc(100vh - ${theme.spacing(40)}px)`,
            overflowY: 'scroll',
        },
    };
});

function Dashboard() {
    const classes = useStyles();
    const {isOpen, closeModal, openModal} = useModal();
    const {showError} = useContext(overlayLoaderOrErrorContext);

    const {selectedDashboardMetadata} = useContext(projectLayoutContext);
    const {name: dashboardName, _id: dashboardId} = selectedDashboardMetadata;
    const {data: fetchedDashboard} = useFetch(api.getDashboard, [dashboardId], !!dashboardId);
    const dispatch = useDispatch()
    const [layout, setLayout] = useState([]);
    const [charts, setCharts] = useState([]);
    const [chartsCount, setChartsCount] = useState(0);

    useEffect(() => {
        if (fetchedDashboard) {
            const {dashboard} = fetchedDashboard;
            const {count, charts: fetchedCharts, layout: fetchedLayout} = dashboard;
            setCharts(fetchedCharts || []);
            setLayout(fetchedLayout || []);
            setChartsCount(count || 0);
        }
    }, [fetchedDashboard]);

    function saveDashboard() {
        api
            .saveDashboard({
                charts,
                layout,
                dashboardId,
                name: dashboardName,
                count: chartsCount,
            })
            .then(() =>
                dispatch(enqueueSnackbarAction({
                        message: 'Saved Successfully',
                        options: {
                            variant: snackbarVariant.SUCCESS
                        },
                    }),
                ))
            .catch(() => {
                const errorConfigs = errors[errorTypes.FAILED_TO_SAVE_DASHBOARD](dashboardName);
                showError(errorConfigs);
            });
    }

    function onApply(chartType, config) {
        addChart(chartType, config);
        setChartsCount((prevChartsCount) => prevChartsCount + 1);
        closeModal();
    }

    function addChart(chartType, config) {
        setCharts((prevCharts) => {
            return prevCharts.concat({
                config,
                chartType,
                layout: getNewWidgetLayout(prevCharts.length, COLUMNS, chartsCount),
            });
        });
    }

    function onLayoutChange(changedLayout) {
        setLayout(changedLayout);
    }

    if (!fetchedDashboard) {
        return null;
    }

    return (
        <Box>
            <ProjectHeader/>
            <DashboardHeader
                onAddChartClick={openModal}
                dashboardName={dashboardName}
                onSaveClick={saveDashboard}
                isSaveDisable={charts.length === 0}
            />
            <Box pt={3} className={classes.gridContainer}>
                {charts.length === 0 ? (
                    <Box p={8} display="inline-flex">
                        <CreateNewChartWidget openChartConfig={openModal}/>
                    </Box>
                ) : (
                    <GridLayout
                        layout={layout}
                        onLayoutChange={onLayoutChange}
                        className={classes.reactGridLayout}
                        margin={[32, 32]}
                    >
                        {charts.map((item) => {
                            return renderWidget(item);
                        })}
                    </GridLayout>
                )}
            </Box>
            {isOpen && (
                <ChartConfigurationWizard isOpen={isOpen} closeModal={closeModal} onApply={onApply}/>
            )}
        </Box>
    );
}

export default Dashboard;
