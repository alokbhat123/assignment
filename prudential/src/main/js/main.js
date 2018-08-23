
var weatherForecast = (() => {



    var init = () => {
        dataModule.getApiData(cb);
        function cb() {
            htmlModule.drawHighChart('splineChart', 'spline', '<u>Mumbai Weather Forecast (5 Days)</u>');
            htmlModule.drawHighChart('columnChart', 'column', '');
            htmlModule.drawBootstrapModal();
        }
    }

    var htmlModule = (() => {


        drawHighChart = (parent, chartType, chartTitle) => {

            getChartTitle = () => {
                return chartTitle;
            }
            getChartType = () => {
                return chartType;
            }
            getLegendObj = () => {

                let obj = {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                }

                if (chartType === "spline") {
                } else {
                    obj = { enabled: false }
                }

                return obj
            }
            getXAxis = () => {

                let primaryXAxis = {
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return moment(this.value).format("DD-MMM-YY");
                        }
                    }
                };

                let secondaryXAxis = {
                    type: 'datetime',
                    tickWidth: 0,
                    lineWidth: 0,
                    linkedTo: 0,
                    labels: {
                        x: -5,
                        useHTML: true,
                        formatter: function () {
                            let o = _formattedData.filter((v) => {
                                if (v["x"] === this.value) {
                                    return true;
                                }
                                return false;
                            });
                            if (o.length > 0) {
                                return '<img class="img" src="' + utilitiesModule.getImage("clouds", o[0]["clouds"]) + '"><img>&nbsp;';
                            }
                            return '<img class="img" src="../resources/css/images/Cloud-Rain.svg"><img>&nbsp;';
                        }
                    },
                    offset: -290
                }

                if (chartType === "spline") {
                    return [primaryXAxis, secondaryXAxis]
                } else {
                    return [primaryXAxis];
                }
            }
            getYAxis = () => {
                return [{
                    title: {
                        text: 'Temperature (deg C)',
                        style: {
                            "color": "#f70303b0",
                            "font-weight": "bold",
                            "letter-spacing": "2px"
                        }
                    },
                    "labels": {
                        style: {
                            "color": "#f70303b0",
                            "font-weight": "bold",
                            "font-size": "13px"
                        }
                    }
                },
                {
                    title: {
                        text: 'Wind speed (Km/h)',
                        style: {
                            "color": "#00aff0cc",
                            "font-weight": "bold",
                            "letter-spacing": "2px"
                        }
                    },
                    "labels": {
                        style: {
                            "color": "#00aff0cc",
                            "font-weight": "bold",
                            "font-size": "13px"
                        }
                    },
                    "opposite": true
                }
                ]
            }
            getSeries = (type) => {
                let temperature = {
                    name: "Temperature",
                    "color": "#f70303b0",
                    data: dataModule.formatToChartData("tempDeg"),
                    "yAxis": 0
                }
                let windSpeed = {
                    name: "Wind Speed",
                    "color": "#00aff0cc",
                    data: dataModule.formatToChartData("windSpeed"),
                    "yAxis": 1
                }

                return [temperature, windSpeed];
            }
            getChartObj = () => {

                if (chartType === "spline") {
                    return {
                        marginTop: 100,
                        type: getChartType()
                    }

                } else {
                    return {
                        marginTop: -25,
                        type: getChartType()
                    }
                }

            }

            Highcharts.setOptions({
                time: {
                    useUTC: false
                }
            });


            Highcharts.chart(parent, {
                chart: getChartObj(),
                title: {
                    text: getChartTitle()
                },
                legend: getLegendObj(),
                xAxis: getXAxis(),
                yAxis: getYAxis(),
                tooltip: {
                    shared: false,
                    formatter: function () {

                        let o = _formattedData.filter((v) => {
                            if (v["x"] === this.x) {
                                return true;
                            }
                            return false;
                        });

                        var s = "";
                        s = s + "<b>" + moment(this.x).format("DD-MMM") + "</b> <br/><br/>";
                        // console.log(this)
                        // $.each(this.points, (k, v) => {
                        //     if (k == 0) {
                        //         s = s + v.series.name + ': <b>' + v.y.toFixed(1) + ' deg.</b> <br/>';
                        //     } else {
                        //         s = s + v.series.name + ' : <b>' + v.y.toFixed(1) + ' Km/h.</b> <br/>';
                        //     }
                        // }); 
                        if (o.length > 0 && o[0]["details"]) {
                            s = s + "Temperature" + ': <b>' + o[0]["details"]["tempDeg"].toFixed(1) + ' deg.</b> <br/>';
                            s = s + "Wind Speed" + ' : <b>' + o[0]["details"]["windSpeed"].toFixed(1) + ' Km/h.</b> <br/>';
                            s = s + "Humidity" + ': <b>' + o[0]["details"]["humidity"] + ' %.</b> <br/>';
                        }

                        return s;
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        events: {
                            mouseOver: function (e) {
                                var currentChart = this.chart.container;
                                var charts = Highcharts.charts;
                                // for (let i = 0; i < Highcharts.charts.length; i++) {
                                //     if (charts[i].container !== currentChart) {
                                //         var point = charts[i].series[0].searchPoint(e, true)
                                //         charts[i].series[0].data[0].setState('hover');
                                //         //charts[i].series[1].data[0].setState('hover');
                                //         if (point)
                                //             charts[i].tooltip.refresh(point);
                                //     }
                                // }
                                //instead of data[i] it should be data[xposition]
                                // chart.series[0].data[1].setState('hover');
                                // chart.tooltip.refresh(chart.series[0].data[1]);
                            },
                            click: function () {
                                $("#detailsModal").modal('show');
                                $("body").addClass('modal-open');
                                $("#detailsModal").addClass('show').removeClass('hide');
                                console.log('clicked')
                            }
                        },
                        cursor: 'pointer',
                        allowPointSelect: true
                    },

                    line: {
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y.toFixed(1);
                            }
                        }
                    },
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: getSeries()
            });
            var onHover = (e) => {
                var chart,
                    point,
                    i,
                    event;

                for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                    chart = Highcharts.charts[i];
                    event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                    point = chart.series[0].searchPoint(event, true); // Get the hovered point

                    if (point) {
                        point.highlight(e);
                    }

                    point = chart.series[1].searchPoint(event, true); // Get the hovered point

                    if (point) {
                        point.highlight(e);
                    }
                }
            }
            $("#columnChart").bind('mousemove touchmove touchstart', function (e) {
                onHover(e);
            });
            $("#splineChart").bind('mousemove touchmove touchstart', function (e) {
                onHover(e);
            });
            Highcharts.Point.prototype.highlight = function (event) {
                this.onMouseOver();
                this.series.chart.tooltip.refresh(this);
            };
        }

        drawBootstrapModal = () => {

            var columns = [["x", "Day", "string"], ["tempDeg", "Average Temp. (deg)"], ["temp_min", "Min Temp.(deg)"], ["temp_max", "Max Temp.(deg)"], ["humidity", "Humidity(%)"]]

            function drawTable() {
                let trs = [], tds = [], ths = [];
                $.each(_formattedData, (k, v) => {
                    tds = [];
                    $.each(columns, (k1, col) => {
                        if (col[2] == "string") {
                            tempDate = moment(v[col[0]]).format("MMDDYYYY") + " 05:00";
                            convertedDate = moment(tempDate, "MMDDYYYY hh:mm").format("MM/DD/YYYY");
                            tds.push('<td>' + convertedDate + '</td>');
                        }
                        else
                            tds.push('<td>' + v["details"][col[0]].toFixed(2) + '</td>');
                        if (k == 0)
                            ths.push('<th>' + col[1] + '</th>');
                    });
                    trs.push('<tr>' + tds.join('') + '</tr>');
                });
                return ('<table id="detailsTbl"><thead><tr>' + ths.join('') + '</tr></thead><tbody>' + trs.join('') + '</tbody></table>');
            }

            $("#detailsModal").find('.modal-body').append(drawTable());
            $("#detailsTbl").DataTable({
                "paging": false,
                "searching": false,
                "ordering": false,
                "info": false
            });
            handleEvents();
        }

        handleEvents = () => {
            $("body").off('click', '.btnClose');
            $("body").on('click', '.btnClose', () => {
                $("body").removeClass('modal-open');
                $("#detailsModal").removeClass('show').addClass('hide');
                $('.modal-backdrop').remove();
            })
        }


        return {
            drawHighChart: drawHighChart,
            drawBootstrapModal: drawBootstrapModal
        }
    })();

    var dataModule = (() => {
        _data = [],
            _formattedData = [],
            c = {
                "temp": "temp",
                "tempDeg": "tempDeg",
                "temp_min": "temp_min",
                "temp_max": "temp_max",
                "humidity": "humidity",
                "speed": "speed",
                "clouds": "clouds",
                "rain": "rain",
                "wind": "wind",
                "windSpeed": "windSpeed",
                "3h": "3h",
                "all": "all",
                "dt": "dt",
                "dt_txt": "dt_txt",
                "main": "main",
                url: "http://api.openweathermap.org/data/2.5/forecast?q=" + "Mumbai,india" + "&appid=" + "08832c52a69b51bff174688fd1a2ed18"
            }


        var setData = (data) => {
            preFormatData(data);
            console.log(_data);
        }

        var preFormatData = (data) => {
            if (data && !$.isEmptyObject(data)) {
                var list = data["list"];
                $.each(list, (k, v) => {
                    _data.push({
                        [c.temp]: v[c.main][c.temp],
                        [c.tempDeg]: (v[c.main][c.temp] - 273.5),
                        [c.temp_min]: v[c.main][c.temp_min],
                        [c.temp_max]: v[c.main][c.temp_max],

                        [c.humidity]: v[c.main][c.humidity],
                        [c.windSpeed]: v[c.wind] ? v[c.wind][c.speed] : 0,

                        [c.rain]: v[c.rain][c["3h"]],

                        [c.clouds]: v[c.clouds][c.all],

                        [c.dt]: v[c.dt],
                        [c.dt_txt]: v[c.dt_txt]
                    });
                });
            }
        }
        var getApiData = (cb) => {
            $.ajax({
                type: "GET",
                url: c.url
            }).done((data) => {
                setData(data);
                cb();
            })

        }
        var getData = (key) => {
            var temp = [];
            var year = {}, date, tempDate, convertedDate;
            $.each(_data, function (k, v) {
                date = v[c.dt] * 1000;
                tempDate = moment(date).format("MM/DD/YYYY") + " 00:00";
                convertedDate = moment(tempDate, "MM/DD/YYYY HH:mm").valueOf();
                if (!year[moment(date).date()]) {
                    console.log(v)
                    temp.push({ "clouds": v[c.clouds], "x": convertedDate, "y": v[c[key]], "marker": { symbol: 'url(' + (utilitiesModule.getImage(key, v[c[key]])) + ')' }, "details": v });
                    year[moment(date).date()] = true;
                }
            });
            _formattedData = temp;
            return temp;
        }


        var formatToChartData = (key) => {
            return getData(key);

        }
        return {
            getApiData: getApiData,
            formatToChartData: formatToChartData
        }

    })();

    var utilitiesModule = (() => {

        var imageMap = {
            "tempDeg": {
                "hot": "https://www.highcharts.com/samples/graphics/sun.png",
                "warm": "../resources/css/images/Sunrise.svg",
                "cold": "../resources/css/images/Cloud-Snow.svg"
            },
            "clouds": {
                "raining": "../resources/css/images/Cloud-Rain.svg",
                "snowing": "../resources/css/images/Cloud-Snow.svg",
                "sun": "../resources/css/images/Cloud-Sun.svg"
            }
        }
        getImageType = (type, val) => {
            switch (type) {
                case "tempDeg":
                    return (() => {
                        if (val < 26) {
                            return "cold"
                        } else if (val < 27) {
                            return "warm";
                        } else {
                            return "hot";
                        }
                    })()
                    break;
                case "clouds":
                    return (() => {
                        if (val < 85) {
                            return "sun"
                        } else if (val < 95) {
                            return "raining";
                        } else {
                            return "snowing";
                        }
                    })()
            }
        }
        getImage = (type, val) => {
            console.log("type " + type);
            console.log("val " + val);
            console.log(getImageType(type, val));
            console.log()
            if (imageMap[type]) {
                console.log(imageMap[type][getImageType(type, val)])
                return imageMap[type][getImageType(type, val)];
            }
            return "";
        }


        return {
            getImage: getImage
        }

    })();


    return {
        init: init
    }

})();



$(document).ready(function () {
    weatherForecast.init();
})