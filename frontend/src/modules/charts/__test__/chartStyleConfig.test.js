import { configs, yAxisLegendName, marker, line, tooltip, layoutConfig } from '../chartStyleConfig';

describe('Common chart styles', () => {
  it('should match config', () => {
    expect(configs).toMatchInlineSnapshot(`
      Object {
        "displaylogo": false,
        "modeBarButtonsToRemove": Array [
          "select2d",
          "lasso2d",
          "toImage",
        ],
        "responsive": true,
      }
    `);
  });
  it('should match marker config', () => {
    expect(marker).toMatchInlineSnapshot(`
      Object {
        "opacity": 1,
        "size": 4,
        "symbol": "circle",
      }
    `);
  });
  it('should match line config', () => {
    expect(line).toMatchInlineSnapshot(`
      Object {
        "opacity": 1,
        "size": 1,
      }
    `);
  });
  it('should match tooltip config', () => {
    expect(tooltip('yColumn', 'red')).toMatchInlineSnapshot(`
      Object {
        "hoverinfo": "x+y",
        "hoverlabel": Object {
          "bgcolor": "#fff",
          "bordercolor": "red",
          "font": Object {
            "color": "#000",
          },
        },
        "hovertemplate": "yColumn: %{y}<extra></extra>",
      }
    `);
  });
  it('should match yAxisLegendName config', () => {
    expect(yAxisLegendName('yColumn')).toMatchInlineSnapshot(`"yColumn"`);
  });
  it('should match layout config', () => {
    const annotation = [
      {
        direction: 'horizontal',
        label: 'label',
        start: 2,
        end: '3',
        color: 'red',
        opacity: '0.2',
      },
      {
        direction: 'vertical',
        start: '2',
        end: '3',
        color: 'red',
        opacity: '0.2',
      },
      {
        direction: 'vertical',
        label: 'label',
        start: '2',
        end: '3',
        color: 'red',
        opacity: '0.2',
      },
    ];
    expect(layoutConfig('xColumn', 'date', 'log', annotation, true)).toMatchInlineSnapshot(`
      Object {
        "annotations": Array [
          Object {
            "showarrow": false,
            "text": "label",
            "x": 0,
            "xanchor": "auto",
            "xref": "paper",
            "y": 3,
            "yanchor": "top",
            "yref": "x",
          },
          Object {
            "showarrow": false,
            "text": "label",
            "x": 2,
            "xanchor": "left",
            "xref": "x",
            "y": 0,
            "yanchor": "auto",
            "yref": "paper",
          },
        ],
        "autosize": true,
        "colorway": Array [
          "#62CEFF",
          "#EC3237",
          "#FAA847",
          "#21C694",
          "#1E3FD8",
          "#C962BE",
        ],
        "datarevision": undefined,
        "font": Object {
          "family": "Roboto",
          "size": 10,
          "weight": 400,
        },
        "height": undefined,
        "legend": Object {
          "font": Object {
            "color": "#929599",
            "family": "Roboto",
            "size": 12,
            "weight": 400,
          },
        },
        "margin": Object {
          "autoexpand": true,
          "b": 60,
          "l": 32,
          "r": 0,
          "t": 40,
        },
        "shapes": Array [
          Object {
            "fillcolor": "red",
            "line": Object {
              "width": 0,
            },
            "opacity": "0.2",
            "type": "rect",
            "x0": 0,
            "x1": 1,
            "xref": "paper",
            "y0": 2,
            "y1": 3,
            "yref": "y",
          },
          Object {
            "fillcolor": "red",
            "line": Object {
              "width": 0,
            },
            "opacity": "0.2",
            "type": "rect",
            "x0": 3,
            "x1": 2,
            "xref": "x",
            "y0": 0,
            "y1": 1,
            "yref": "paper",
          },
          Object {
            "fillcolor": "red",
            "line": Object {
              "width": 0,
            },
            "opacity": "0.2",
            "type": "rect",
            "x0": 3,
            "x1": 2,
            "xref": "x",
            "y0": 0,
            "y1": 1,
            "yref": "paper",
          },
        ],
        "showlegend": true,
        "width": undefined,
        "xaxis": Object {
          "automargin": true,
          "autotypenumbers": "strict",
          "color": "#929599",
          "gridwidth": 0.5,
          "linewidth": 0.5,
          "showline": true,
          "tickwidth": 1,
          "title": Object {
            "font": Object {
              "family": "Roboto",
              "size": 14,
              "weight": 700,
            },
            "standoff": 8,
            "text": "xColumn",
          },
          "type": "date",
          "zerolinecolor": "#c5c7cb",
          "zerolinewidth": 0.5,
        },
        "yaxis": Object {
          "automargin": true,
          "autotypenumbers": "strict",
          "color": "#929599",
          "gridwidth": 0.5,
          "linewidth": 0.5,
          "showline": true,
          "ticklabelposition": "outside",
          "tickwidth": 1,
          "title": Object {
            "standoff": 8,
          },
          "type": "log",
          "zerolinecolor": "#c5c7cb",
          "zerolinewidth": 0.5,
        },
      }
    `);
  });
});
