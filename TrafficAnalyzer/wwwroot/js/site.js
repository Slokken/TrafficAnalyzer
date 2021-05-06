// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function init() {

    const weeklyGraph = {
        selector: 'ta-weeklygraph',
        allData: null,
        update: function (data = []) {

            const plotlyData = [];
            const graphData = {};

            for (const line of data) {
                graphData[line.sted] = graphData[line.sted] || {};

                graphData[line.sted].y = graphData[line.sted].y || [];
                graphData[line.sted].x = graphData[line.sted].x || [];

                graphData[line.sted].y.push(line.passeringer);
                graphData[line.sted].x.push(line.timestamp);
            }

            for (var trace in graphData) {
                plotlyData.push({
                    x: graphData[trace].x,
                    y: graphData[trace].y,
                    type: 'scatter',
                    name: trace
                });
            }

            const layout = {
                title: 'Ukentlig'
            };

            Plotly.react(weeklyGraph.selector, plotlyData, layout);
        }
    };

    const dailyGraph = {
        selector: 'ta-dailygraph',
        allData: null,
        update: function (data = []) {

            const plotlyData = [];
            const graphData = {};

            for (const line of data) {
                graphData[line.sted] = graphData[line.sted] || {};

                graphData[line.sted].y = graphData[line.sted].y || [];
                graphData[line.sted].x = graphData[line.sted].x || [];

                graphData[line.sted].y.push(line.passeringer);
                graphData[line.sted].x.push(line.timestamp);
            }

            for (var trace in graphData) {
                plotlyData.push({
                    x: graphData[trace].x,
                    y: graphData[trace].y,
                    type: 'scatter',
                    name: trace
                });
            }

            const layout = {
                title: 'Daglig'
            };

            Plotly.react(dailyGraph.selector, plotlyData, layout);
        }
    };

    const hourlyGraph = {
        selector: 'ta-hourlygraph',
        allData: null,
        update: function (data = []) {

            const plotlyData = [];
            const graphData = {};

            for (const line of data) {
                graphData[line.sted] = graphData[line.sted] || {};

                graphData[line.sted].y = graphData[line.sted].y || [];
                graphData[line.sted].x = graphData[line.sted].x || [];

                graphData[line.sted].y.push(line.passeringer);
                graphData[line.sted].x.push(line.timestamp);
            }

            for (var trace in graphData) {
                plotlyData.push({
                    x: graphData[trace].x,
                    y: graphData[trace].y,
                    type: 'scatter',
                    name: trace
                });
            }

            const layout = {
                title: 'Time for time'
            };

            Plotly.react(hourlyGraph.selector, plotlyData, layout);
        }
    };

    

    const northernCrossings = new Set([
        'VALDALEN', 'DREVSJØ', 'LINNES', 'STØA', 'FLERMOEN', 'BORVEGGEN', 'LANGFLOEN', 'BADSTUKNAPPEN',
        'SAGMOVEGEN', 'STØA KANAL'
    ]);

    const northMiddleCrossings = new Set([
        'HALSJØEN', 'PEISTORPET', 'JUVBERGET', 'POSSÅSEN',  'HØKLINGEN', 'LINNA', 'LINNHEIM', 'MATHIASHEMVEGEN', 
    ]);

    const southMiddleCrossings = new Set([
        'FALL', 'ROSALA', 'VARPAAVEGEN', 'GRUE', 'SJØVEGEN', 'MELLOMBRÅTEN', 'ROTNEMOEN', 'RIKSÅSEN'
    ]);

    const middle = Array.from(northMiddleCrossings).concat(Array.from(southMiddleCrossings));
    const middleCrossings = new Set(middle);

    const southernCrossings = new Set([
        'KVERNMOEN', 'LEBIKO', 'LARBEKKEN', 'MITANDERSFORS', 'HÅKERUD-TOMTA', 'KJERRET', 'HAUGEN', 'SVARTDALEN', 'INGELSRUDVEGEN', 'VESTMARKA',
        'MAGNORMOEN','SANDDALEN','VILSBERGVEGEN','LEIRSJØEN'
    ]);


    const allCrossings = Array.from(northernCrossings).concat(Array.from(southernCrossings)).concat(Array.from(middleCrossings));
    const crossings = new Set(allCrossings);


    //Hack until Amund updates HTML
    const teigFilter = document.getElementById('teig-filter');
    const optionMiddleNorth = document.createElement('option');
    optionMiddleNorth.innerHTML = 'MIDT(NORD)';
    teigFilter.appendChild(optionMiddleNorth);

    const optionMiddleSouth = document.createElement('option');
    optionMiddleSouth.innerHTML = 'MIDT(SØR)';
    teigFilter.appendChild(optionMiddleSouth);

    const locationFilter = document.getElementById('location-filter');

    for (const crossing of crossings) {
        const option = document.createElement('option');
        option.innerHTML = crossing;
        locationFilter.appendChild(option);
    }

    $('#ta-view').on('input', '.ta-filter', function (event) {
        updateGraphs();
    });

    const updateGraphs = function () {
        dailyGraph.update(applyFilter(dailyGraph.allData));
        hourlyGraph.update(applyFilter(hourlyGraph.allData));
        weeklyGraph.update(applyFilter(weeklyGraph.allData));
    };

    const applyFilter = (data) => {
        const location = $('#location-filter').val().toUpperCase();
        const dateFrom = $('#date-from-filter').val();
        const dateTo = $('#date-to-filter').val();
        const teig = $('#teig-filter').val();
        const day = $('#day-filter').val();

        let result = data;
        if (teig) {
            switch (teig) {
                case 'NORD': result = result.filter(d => northernCrossings.has(d.sted));
                    break;
                case 'MIDT': result = result.filter(d => middleCrossings.has(d.sted));
                    break;
                case 'MIDT(SØR)': result = result.filter(d => southMiddleCrossings.has(d.sted));
                    break;
                case 'MIDT(NORD)': result = result.filter(d => northMiddleCrossings.has(d.sted));
                    break;
                case 'SØR': result = result.filter(d => southernCrossings.has(d.sted));
                    break;
                default:
            }
        }
        else if (crossings.has(location)) {
            result = result.filter(d => location === d.sted);
        }

        if (day) {
            const dayOfWeek = parseInt(day);
            result = result.filter(d => d.timestamp.getDay() === dayOfWeek);
        }

        if (dateFrom) {
            const date = new Date(dateFrom);
            result = result.filter(d => d.timestamp >= date);
        }

        if (dateTo) {
            const date = new Date(dateTo);
            result = result.filter(d => d.timestamp <= date);
        }

        return result;
    };


    /**
     * This was copy pasted from another project. Could probably delete 90%
     * */
    const dropzone = new Dropzone(
        '#filedrop',
        {
            url: 'duckface', //Dummy because url is set in "processing" callback
            paralleluploads: 1,
            maxFiles: 1,
            maxFilesize: 250, //In megabyte. Also see setting in Web.config
            clickable: true,
            previewsContainer: false,
            autoQueue: false,
            accept: (file, done) => {
                parseFile(file);
            },
            processing: function (file) {
                this.options.url = viewModel.uploadUrl()
            },
            success: (fileRes, result) => {
                viewModel.uploadDone(fileRes, result)
            },
            error: (file, errorMessage, xhr) => {
                if (xhr)
                    quick3.common.handleAjaxError(xhr, errorMessage, null, true);
                else {
                    toastr.warning(errorMessage);
                    viewModel.dropzone.removeFile(file);
                }
            },
            complete: () => {
                const barElement = $('#@ViewBag.Guid div.progressBar');
                barElement.jqxProgressBar('actualValue', 0);
                barElement.hide();
                qui.qProgress.removeTask($('#@ViewBag.Guid'));
            },
            sending: (file) => {
            },
            uploadprogress: (file, progress, bytesSent) => {
            },
            acceptedFiles: 'text/csv,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
        }
    );

    var parseFile = async function (file) {
        let weekly, daily, hourly;
        [weekly, daily, hourly] = await parseExcel(file);

        const filteredWeekly = weekly.filter(l => crossings.has(l.sted));
        const filteredDaily = daily.filter(l => crossings.has(l.sted));
        const filteredHourly = hourly.filter(l => crossings.has(l.sted));

        for (const line of filteredWeekly) {
            line.passeringer = parseInt(line.passeringer);
            line.timestamp = new Date(line.uke);
        }

        for (const line of filteredDaily) {
            line.passeringer = parseInt(line.passeringer);
            line.timestamp = new Date(line.dato);
        }

        for (const line of filteredHourly) {
            line.passeringer = parseInt(line.passeringer);
            line.timestamp = convertUTCDateToLocalDate(ExcelDateToJSDate(line.time)); //There is some weirdness in the Excel files. Sometimes we get a date as string, other times it's serialized 👍
            //line.timestamp = new Date(line.time);
        }

        createGraphs(filteredWeekly, filteredDaily, filteredHourly);

    };

    var convertUTCDateToLocalDate = function (date) {
        var newDate = new Date(date);
        newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return newDate;
    };
    
    var createGraphs = function (weekly, daily, hourly) {
        createWeekGraph(weekly);
        createHourlyGraph(hourly);
        createDayGraph(daily);
    };

    var createWeekGraph = function (data) {
        const graphContainer = document.getElementById(weeklyGraph.selector);
        weeklyGraph.allData = data;

        const weeklyGraphData = {
            x: [],
            y: [],
            type: 'scatter'
        };

        Plotly.newPlot(graphContainer, [weeklyGraphData],
            {
                margin: { t: 0 }
            },
            {
                responsive: true
            }
        );

        weeklyGraph.update(data);
    };

    var createDayGraph = function (data) {
        const graphContainer = document.getElementById('ta-dailygraph');
        dailyGraph.allData = data;

        const graphData = {
            x: [],
            y: [],
            type: 'scatter'
        };

        Plotly.newPlot(graphContainer, [graphData],
            {
                margin: { t: 0 }
            },
            {
                responsive: true
            }
        );

        dailyGraph.update(data);
    };

    var createHourlyGraph = function (data) {
        const graphContainer = document.getElementById('ta-hourlygraph');
        hourlyGraph.allData = data;

        const graphData = {
            x: [],
            y: [],
            type: 'scatter'
        };

        Plotly.newPlot(graphContainer, [graphData],
            {
                margin: { t: 0 }
            },
            {
                responsive: true
            }
        );

         hourlyGraph.update(data);
    };

    var parseExcel = function (file) {
        return new Promise((resolve) => {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                const result = [];

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                    result.push(JSON.parse(json_object));
                });

                resolve(result);

            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        });
    };

    var ExcelDateToJSDate = function (serial) {
        //Date formatting in excel file varies
        if (typeof serial === 'string')
            return new Date(serial);

        var utc_days = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);

        var fractional_day = serial - Math.floor(serial) + 0.0000001;

        var total_seconds = Math.floor(86400 * fractional_day);

        var seconds = total_seconds % 60;

        total_seconds -= seconds;

        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;

        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    };
}


document.addEventListener("DOMContentLoaded", init);