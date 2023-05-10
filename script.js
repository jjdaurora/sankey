
function updateRevenueDisplay(revenueValue, costOfSalesValue, operatingExpensesValue, rdValue, sgaValue, taxValue) {
    const revenueLabel = d3.select("#revenue-value-display");
    const grossProfitDisplay = d3.select("#gross-profit-value-display");
    const operatingProfitDisplay = d3.select("#operating-profit-value-display");
    const netIncomeDisplay = d3.select("#net-income-gaap-display")

    const operatingProfit = (revenueValue - costOfSalesValue) - operatingExpensesValue 

    revenueLabel.text(revenueValue);
    grossProfitDisplay.text(revenueValue - costOfSalesValue)
    operatingProfitDisplay.text((revenueValue - costOfSalesValue) - operatingExpensesValue )
    operatingProfitDisplay.text(operatingProfit)
    netIncomeDisplay.text(operatingProfit - ( rdValue + sgaValue + taxValue ))

}

  function createSliders(nodesAndLinks) {

   const slidersContainer = document.getElementById('sliders-container');

   const maxValues = {
    "Auto Sales Revenue": 40000,
    "Service Revenue": 10000,
    "Energy Revenue": 4000,
    "Auto Lease Credits": 2000,
    "Auto Reg Credits": 2000,
    "R & D": 5000,
    "SGA Expense": 5000,
    "Operating Expenses": 5000, // changed from "Operating Expense"
    "Tax": 4000,
    "Cost of Sales": 30000
};



  nodesAndLinks.nodes.forEach((node, index) => {

    if (node === "Revenue" || node === "Gross Profit" || node === "Operating Profit" || node === "Net Income (GAAP)") {
      return; // Skip creating a slider for the "Revenue" node
    }




    const label = document.createElement('label');
    label.textContent = node;
    label.htmlFor = `slider-${index}`;

    const slider = document.createElement('input');


  
    slider.type = 'range';
    slider.min = 0;
    slider.max = maxValues[node] || 1000;
    slider.value = nodesAndLinks.links.find(link => link.source === node)?.value || 0;
    slider.id = `slider-${index}`;
    slider.setAttribute('data-node-name', node);

        if (slider.id === "Auto Sales Revenue") {
      header = document.createElement("h2");
      header.append("Revenue")
    }

      if (slider.dataset.nodeName === "Operating Expenses") {
      header = document.createElement("h2");
      text = document.createTextNode("Expenses");
      header.appendChild(text)
      slider.prepend(header)

    }

  slider.addEventListener('input', (event) => {
    const nodeName = event.target.getAttribute('data-node-name');
    const newValue = parseFloat(event.target.value);

    const linkToUpdate = nodesAndLinks.links.find(link => link.source === nodeName || link.target === nodeName);
    if (linkToUpdate) {
      linkToUpdate.value = newValue;

      if (["Service Revenue", "Auto Sales Revenue", "Energy Revenue", "Auto Lease Credits", "Auto Reg Credits"].includes(nodeName)) {
        const revenueValue = ["Service Revenue", "Auto Sales Revenue", "Energy Revenue", "Auto Lease Credits", "Auto Reg Credits"]
          .map(name => parseFloat(document.querySelector(`input[data-node-name="${name}"]`).value))
          .reduce((a, b) => a + b, 0);

        const costOfSalesValue = parseFloat(document.querySelector(`input[data-node-name="Cost of Sales"]`).value);
        const operatingExpensesValue = parseFloat(document.querySelector(`input[data-node-name="Operating Expenses"]`).value);
        const rdValue = parseFloat(document.querySelector(`input[data-node-name="R & D"]`).value);
        const sgaValue =parseFloat(document.querySelector(`input[data-node-name="SGA Expense"]`).value);
        const taxValue = parseFloat(document.querySelector(`input[data-node-name="Tax"]`).value);


        const sankeyData = parseFlowData(nodesAndLinks.links.map(link => `${link.source} [${link.value}] ${link.target}`).join('\n'));
        d3.select('#sankey-chart').selectAll('*').remove();
        drawSankeyChart(sankeyData);

        const revenueLink = nodesAndLinks.links.find(link => link.source === "Revenue");
        const costOfSalesLink = nodesAndLinks.links.find(link => link.source === "Cost of Sales");
        const operatingProfitLink = nodesAndLinks.links.find(link => link.source === "Operating Profit");
        const netIncomeLink = nodesAndLinks.links.find(link => link.source === "Net Income (GAAP)");


        if (revenueLink) {
          revenueLink.value = revenueValue;
        }
        if (costOfSalesLink) {
          costOfSalesLink.value = revenueValue - costOfSalesValue
        }
        if (operatingProfitLink) {
          operatingProfitLink.value = (revenueValue - costOfSalesValue) - operatingExpensesValue
        }
        if (netIncomeLink) {
          netIncomeLink.value = operatingExpensesValue - (rdValue + sgaValue + taxValue)
        }


        updateRevenueDisplay(revenueValue, costOfSalesValue, operatingExpensesValue, rdValue, sgaValue, taxValue);
      } else {
                const sankeyData = parseFlowData(nodesAndLinks.links.map(link => `${link.source} [${link.value}] ${link.target}`).join('\n'));
        d3.select('#sankey-chart').selectAll('*').remove();
        drawSankeyChart(sankeyData);

      }

  
    }

  });

    slidersContainer.appendChild(label);
    slidersContainer.appendChild(slider);
    slidersContainer.appendChild(document.createElement('br'));
  });

const initialRevenueValue = ["Service Revenue", "Auto Sales Revenue", "Energy Revenue", "Auto Lease Credits", "Auto Reg Credits"]
updateRevenueDisplay(initialRevenueValue.map(name => parseFloat(document.querySelector(`input[data-node-name="${name}"]`).value)).reduce((a, b) => a + b, 0));
}





function drawSankeyChart(data) {
  const margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const sankey = d3.sankey()
    .nodeWidth(2)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 5]]);

  const svg = d3.select("#sankey-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const {nodes, links} = sankey(data);

  svg.append("g")
    .attr("class", "nodes")
    .selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .style("fill", "#080616")
      .attr("id", d => d.name.split(" ").join("-").toLowerCase() + "-node"); // assign ID to node

  svg.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width))
      .style("stroke", linkColor)
      .style("stroke-opacity", 0.60)
      .style("fill", "none");

  svg.append("g")
    .attr("class", "node-labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
      .style("font-size", "12px")
      .style("font-family", "Roboto")
      .style("fill", "white")
      .attr("id", d => d.name.split(" ").join("-").toLowerCase() + "-label"); // assign ID to label


  // Add node labels' value display spans
// Add node labels' value display spans
svg.append("g")
  .attr("class", "node-value-display")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
  .attr("y", d => (d.y1 + d.y0) / 2)
  .attr("dy", "1.5em")
  .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
  .attr("id", d => d.name.split(" ").join("-").toLowerCase() + "-value-display") // Assign an ID to the value display span
  .text(d => {
    const slider = document.querySelector(`input[data-node-name="${d.name}"]`);
    return slider ? slider.value : 0;
  }) // Display the initial value based on the slider value
  .style("fill", "white")
  .style("font-size", "12px")
  .style("font-family", "sans-serif");


}


function linkColor(d) {
  const greenCategories = [
    "Auto Sales Revenue",
    "Service Revenue",
    "Energy Revenue",
    "Auto Lease Credits",
    "Auto Reg Credits",
    "Gross Profit",
    "Operating Profit",
    "Net Income (GAAP)"
  ];

  const redCategories = [
    "SGA Expense",
    "R & D",
    "Cost of Sales",
    "Tax",
    "Operating Expenses"
  ];

  if (redCategories.includes(d.source.name) || redCategories.includes(d.target.name)) {
    return "#dc3545";
  } else if (greenCategories.includes(d.source.name) || greenCategories.includes(d.target.name)) {
    return "#20c997";
  } else {
    return "#080616";
  }
}

function redrawSankeyChart(svg, sankey, data) {
  // Recompute the Sankey layout with new values
  sankey(data);

  // Update the links' widths and positions
  svg.select(".links")
    .selectAll("path")
    .data(data.links)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", d => Math.max(1, d.width));

  // Update the nodes' heights and positions
  svg.select(".nodes")
    .selectAll("rect")
    .data(data.nodes)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0);

  // Update the node labels' positions
  svg.select(".node-labels")
    .selectAll("text")
    .data(data.nodes)
    .attr("y", d => (d.y1 + d.y0) / 2);

  // Update the node value display spans
  svg.select(".node-value-display")
    .selectAll("text")
    .data(data.nodes)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .text(d => nodesAndLinks.links.find(link => link.source === d.name)?.value || 0); // Update the value display text
}



function parseFlowData(input) {
  const lines = input.trim().split('\n');
  const nodes = new Set();
  const links = [];

  for (const line of lines) {
    const [source, amount, target] = line.split(/[\[\]]/).map(s => s.trim());
    const value = parseFloat(amount);

    nodes.add(source);
    nodes.add(target);
    links.push({source, target, value});
  }

  const nodesArray = Array.from(nodes).map(name => ({name}));

  return {
    nodes: nodesArray,
    links: links.map(link => ({
      source: nodesArray.findIndex(node => node.name === link.source),
      target: nodesArray.findIndex(node => node.name === link.target),
      value: link.value
    }))
  };
}

function parseNodesAndLinks(flowData) {
  const lines = flowData.trim().split('\n');
  const nodes = new Set();
  const links = [];

  for (const line of lines) {
    const [source, amount, target] = line.split(/[\[\]]/).map(s => s.trim());
    const value = parseFloat(amount);

    nodes.add(source);
    nodes.add(target);
    links.push({source, target, value});
  }

  return {
    nodes: Array.from(nodes),
    links
  };
}

function parseNodesAndLinks(flowData) {
  const lines = flowData.trim().split('\n');
  const nodes = new Set();
  const links = [];

  for (const line of lines) {
    const [source, amount, target] = line.split(/[\[\]]/).map(s => s.trim());
    const value = parseFloat(amount);

    nodes.add(source);
    nodes.add(target);
    links.push({source, target, value});
  }

  return {
    nodes: Array.from(nodes),
    links
  };
}

const defaultFlowData = `Auto Sales Revenue [900] Revenue
Service Revenue [325] Revenue
Energy Revenue [150] Revenue
Auto Lease Credits [150] Revenue
Auto Reg Credits [150] Revenue
Revenue [1000] Gross Profit
Gross Profit [350] Operating Profit
Gross Profit [650] Operating Expenses
Operating Profit [260] Net Income (GAAP)
Operating Profit [90] Tax
Operating Expenses [640] SGA Expense
Operating Expenses [10] R & D
Revenue [800] Cost of Sales`;



document.getElementById("sankey-input").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const input = document.getElementById("flow-data").value;
  const data = parseFlowData(input);
  
  d3.select("#sankey-chart").selectAll("*").remove();
  drawSankeyChart(data);
});

// Render the default chart on page load
document.getElementById("flow-data").value = defaultFlowData;
const nodesAndLinks = parseNodesAndLinks(defaultFlowData);
createSliders(nodesAndLinks);
document.getElementById("sankey-input").dispatchEvent(new Event("submit"));

