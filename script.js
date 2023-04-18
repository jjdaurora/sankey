 let chartData = [

       [ 'AUTO SALES REVENUE', 'GROSS PROFIT', 37.5],
       [ 'GROSS PROFIT', 'OPERATING PROFIT', 25 ],
       [ 'OPERATING PROFIT',  ' ', 25],
       [ ' ', 'INCOME TAX', .5],
       [ ' ', 'NET INCOME (GAAP)', 25],
       [ 'OPERATING PROFIT', 'OPERATING EXPENSE', 7.5],
       [ 'OPERATING EXPENSE', 'R&D', 7.5],
       [ 'OPERATING EXPENSE', 'SGA EXPENSE',7.5],
       [ 'AUTO SALES REVENUE', '  ', 25],
       [ 'AUTO REG CREDITS', '  ', 2.5],
       [ 'AUTO LEASE REVENUE', '  ', 2.5],
       [ 'ENERGY REVENUE', '  ',5], 
       [ 'SERVICE REVENUE', '  ',  15], 
       [ '  ', 'COST REVENUE',25 ]
    ]
  google.charts.load("current", {packages:["sankey"]});
  google.charts.setOnLoadCallback(drawChart);
   function drawChart(newData = chartData) {
    if (newData) {chartData = newData}
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');
    data.addRows(newData);

  const colors =  [
        '#1ED5BE',         
        '#1ED5BE',           
        '#1ED5BE',

        '#F39187',
        '#F39187', 
        '#F39187',
        '#1ED5BE', 
        '#1ED5BE', 
        '#1ED5BE', 
        '#1ED5BE', 
        '#1ED5BE', 
        '#1ED5BE',
        '#F39187',
        '#F39187'   
      ]
    // Set chart options
        var options = {
        width: 1000,
        height: 500,
        sankey: {
            node: {
            label: {
                fontName: 'Roboto Mono',
                fontSize: 16,
                color: '#fff',
                bold: true,
                italic: false
            },
              interactivity: true, // Allows you to select nodes.
              labelPadding: 6,     // Horizontal distance between the label and the node.
              nodePadding: 10,     // Vertical distance between nodes.
              width: 5,            // Thickness of the node.
              colors: '#DADADA',
            },
            tooltip: {textStyle: {color: '#1ED5BE'}, showColorCode: true},
            link: {
              colorMode: 'source',
              colors: colors
            },
        }
    }
    var chart = new google.visualization.Sankey(document.getElementById('sankey_multiple'));
    chart.draw(data, options);
   }

    const sliders = document.getElementsByClassName("slider")
    // Update the current slider value (each time you drag the slider handle)
    for (let slider of sliders) {

        slider.oninput = function() {
    

                // gross profit

                grossProfit = (  ($('#auto-sales-revenue-slider')[0].value/$('#auto-sales-revenue-slider')[0].max * $('#auto-sales-revenue-slider')[0].dataset.attrMax) + 
                    ( $('#energy-revenue-slider')[0].value/$('#energy-revenue-slider')[0].max * $('#energy-revenue-slider')[0].dataset.attrMax )
                        + ( $('#service-revenue-slider')[0].value/$('#service-revenue-slider')[0].max * $('#service-revenue-slider')[0].dataset.attrMax ) +
                        ( $('#auto-reg-credits-slider')[0].value/$('#auto-reg-credits-slider')[0].max * $('#auto-reg-credits-slider')[0].dataset.attrMax ) +
                            $('#auto-lease-revenue-slider')[0].value/$('#auto-lease-revenue-slider')[0].max * $('#auto-lease-revenue-slider')[0].dataset.attrMax ) - 
                        ( $('#cost-of-revenue-slider')[0].value/$('#cost-of-revenue-slider')[0].max * $('#cost-of-revenue-slider')[0].dataset.attrMax) 
                
                chartData[1][2] = grossProfit


                // operating profit

                operatingProfit = grossProfit - ($("#operating-expense-slider")[0].value/$("#operating-expense-slider")[0].max * $("#operating-expense-slider")[0].dataset.attrMax)       

                chartData[2][2] = operatingProfit
                
                // net income

                netIncome = operatingProfit - ( ($("#rd")[0].value/$("#rd")[0].max * $("#rd")[0].dataset.attrMax) + ($("#sga")[0].value/$("#sga")[0].max * $("#sga")[0].dataset.attrMax) + ($("#income-tax")[0].value/$("#income-tax")[0].max * $("#income-tax")[0].dataset.attrMax) )

                chartData[4][2] = parseInt(netIncome)
                     
                
                chartData[this.dataset.attrVal][2] = (this.value / this.max) * this.dataset.attrMax

                
                if ($(this).attr("id") === "auto-sales-revenue-slider") {
                    num = Math.round((this.value * 10)/6.25)/10
                    $(this).prev().children().text(' ' + num + ' bil')

                } else {
                    if (this.value < 10 ) {
                         $(this).prev().children().text(' ' + parseInt(this.value*100) + ' mil')
                    } else {
                    $(this).prev().children().text(' ' + (parseInt(this.value)/10) + ' bil')}
                }
      
                $("#gross-profit-display").text(' ' + (parseInt(Math.round(grossProfit/2.5)) + ' bil' ))
                $("#operating-profit-display").text(' ' + (parseInt(operatingProfit/2.5) + ' bil' ))
                $("#net-income-display").text(' ' + (parseInt(netIncome/2.5) + ' bil' ))

            drawChart(chartData)
        


        }
    }


    $( document ).ready(function() {
        $('.slider-value-display').each(function() {
          $(this).text(' ' + $(this).parent().next()[0].value + ' bil')
        })
    });

