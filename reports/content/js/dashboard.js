/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 51.111111111111114, "KoPercent": 48.888888888888886};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3851851851851852, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Agent Login"], "isController": false}, {"data": [0.0, 500, 1500, "Deposit Amount"], "isController": false}, {"data": [1.0, 500, 1500, "Admin Login"], "isController": false}, {"data": [0.0, 500, 1500, "Verify OTP Request"], "isController": false}, {"data": [0.7, 500, 1500, "Customer Login"], "isController": false}, {"data": [0.0, 500, 1500, "Send Money Amount"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Read OTP from Gmail"], "isController": false}, {"data": [0.0, 500, 1500, "Verify OTP Request for Customer"], "isController": false}, {"data": [0.0, 500, 1500, "Payment Amount"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 135, 66, 48.888888888888886, 186.4, 2, 1631, 21.0, 616.6, 737.0, 1623.0799999999997, 1.2342744294909302, 0.9974640946139921, 0.40946054207504384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Agent Login", 10, 0, 0.0, 30.1, 14, 47, 32.5, 46.8, 47.0, 47.0, 0.09814891152857115, 0.03268435432738551, 0.025687410439118232], "isController": false}, {"data": ["Deposit Amount", 10, 10, 100.0, 5.499999999999999, 3, 14, 4.0, 13.400000000000002, 14.0, 14.0, 0.10128736237579637, 0.02987185882567432, 0.032641435140637505], "isController": false}, {"data": ["Admin Login", 15, 0, 0.0, 52.266666666666666, 21, 134, 32.0, 134.0, 134.0, 134.0, 0.15654842042643788, 0.0814846758664955, 0.04127741554212718], "isController": false}, {"data": ["Verify OTP Request", 10, 10, 100.0, 14.100000000000001, 6, 27, 15.0, 26.1, 27.0, 27.0, 0.10128325889013805, 0.03174992783567804, 0.026210999615123614], "isController": false}, {"data": ["Customer Login", 20, 6, 30.0, 26.9, 5, 49, 26.5, 46.900000000000006, 48.9, 49.0, 0.1943407960199005, 0.06249650793882151, 0.057694923818407955], "isController": false}, {"data": ["Send Money Amount", 10, 10, 100.0, 5.0, 2, 8, 4.0, 8.0, 8.0, 8.0, 0.10042479689084828, 0.029617469395543147, 0.03255960211695472], "isController": false}, {"data": ["Read OTP from Gmail", 30, 0, 0.0, 764.9000000000001, 467, 1631, 611.5, 1568.9, 1618.9, 1631.0, 0.29902517791998084, 0.7315020221577657, 0.14776048830811556], "isController": false}, {"data": ["Verify OTP Request for Customer", 20, 20, 100.0, 14.699999999999998, 6, 28, 13.0, 26.900000000000002, 27.95, 28.0, 0.20083547557840617, 0.0618392826658901, 0.051974024441677376], "isController": false}, {"data": ["Payment Amount", 10, 10, 100.0, 5.399999999999999, 3, 13, 4.5, 12.400000000000002, 13.0, 13.0, 0.10042983971397582, 0.029618956634395212, 0.032365085064074234], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 30, 45.45454545454545, 22.22222222222222], "isController": false}, {"data": ["401/Unauthorized", 24, 36.36363636363637, 17.77777777777778], "isController": false}, {"data": ["404/Not Found", 12, 18.181818181818183, 8.88888888888889], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 135, 66, "403/Forbidden", 30, "401/Unauthorized", 24, "404/Not Found", 12, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Deposit Amount", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Verify OTP Request", 10, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Customer Login", 20, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Send Money Amount", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Verify OTP Request for Customer", 20, 20, "401/Unauthorized", 14, "404/Not Found", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["Payment Amount", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
