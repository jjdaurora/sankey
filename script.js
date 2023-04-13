
<script type="text/javascript">
  let chartData = [
       [ 'AUTO SALES REVENUE', 'GROSS PROFIT', 20.2 ],
       [ 'GROSS PROFIT', 'OPERATING PROFIT', 5.78 ],
       [ 'OPERATING PROFIT',  ' ', 3.9 ],
       [ ' ', 'INCOME TAX', .276 ],
       [ ' ', 'NET INCOME (GAAP)', 3.7 ],
       [ 'OPERATING PROFIT', 'OPERATING EXPENSE', 1.876],
       [ 'OPERATING EXPENSE', 'R&D', .810],
       [ 'OPERATING EXPENSE', 'SGA EXPENSE', 1.032],
       [ 'AUTO SALES REVENUE', '  ', 20.2 ],
       [ 'AUTO REG CREDITS', '  ', 4.67 ],
       [ 'AUTO LEASE REVENUE', '  ', 5.99 ],
       [ 'ENERGY REVENUE', '  ', 1.31 ], 
       [ 'SERVICE REVENUE', '  ',  1.71 ], 
       [ '  ', 'COST REVENUE',  18.5]
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
        '#DADADA',
        '#1ED5BE',
        '#1ED5BE', 
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
        width: 1200,
        height: 600,
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
</script>

<script>
    const sliders = document.getElementsByClassName("slider")
    // Update the current slider value (each time you drag the slider handle)
    for (let slider of sliders) {

        slider.oninput = function() {
            if ($(this).attr("id") === "slider-auto-sales-revenue") {
                $(this).prev().children().text(' ' + (parseInt(this.value)/6.25) + ' bil')
            } else {
                $(this).prev().children().text(' ' + (parseInt(this.value)/10) + ' bil')
            }

            
            if ($(this)[0].dataset.attrCalc === "do-math" ) {
                

                chartData[5][2] = ($("#gross-profit-slider")[0].value/$("#gross-profit-slider")[0].max * $("#gross-profit-slider")[0].dataset.attrMax) - ($("#operating-expense-slider")[0].value/$("#operating-expense-slider")[0].max * $("#operating-expense-slider")[0].dataset.attrMax)       
                     console.log( chartData[5][2] )
        
    
                chartData[4][2] = ($("#gross-profit-slider")[0].value/$("#gross-profit-slider")[0].max * $("#gross-profit-slider")[0].dataset.attrMax) - ($("#operating-expense-slider")[0].value/$("#operating-expense-slider")[0].max * $("#operating-expense-slider")[0].dataset.attrMax) -  ( ($("#rd")[0].value/$("#rd")[0].max * $("#rd")[0].dataset.attrMax) + ($("#sga")[0].value/$("#sga")[0].max * $("#sga")[0].dataset.attrMax) + ($("#income-tax")[0].value/$("#income-tax")[0].max * $("#income-tax")[0].dataset.attrMax) )
                     

                     console.log( chartData[4][2] )
        
            }
             else {

                 chartData[this.dataset.attrVal][2] = (this.value / this.max) * this.dataset.attrMax

            }

            drawChart(chartData)
        


        }
    }

</script>
<script>

    $( document ).ready(function() {
        $('.slider-value-display').each(function() {
          $(this).text(' ' + $(this).parent().next()[0].value + ' bil')
        })
    });

</script>