// add x-axis, y-axis

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// With a scale function
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Add frame
const FRAME1 = 
d3.select("#scatter_plot")
	.append("svg")
		.attr("height", FRAME_HEIGHT)
		.attr("width", FRAME_WIDTH)
		.attr("class", "frame");

d3.csv('data/scatter-data.csv').then((data) => {


	const MAX_X = 1 + d3.max(data, (d) => {
							return parseInt(d.x)
						});
	const MAX_Y = 1 + d3.max(data, (d) => {
							return parseInt(d.y)
						});

	const X_SCALE = d3.scaleLinear()
						.domain([0, (MAX_X)])
						.range([0, VIS_WIDTH]);

	const Y_SCALE = d3.scaleLinear()
						.domain([0, (MAX_Y)])
						.range([VIS_HEIGHT, 0]);


	FRAME1.selectAll('points')
			.data(data)
			.enter()
			.append('circle')
				.attr('cx', (d) => {
					return X_SCALE(parseInt(d.x)) + MARGINS.left
				})
				.attr('cy', (d) => {
					return MARGINS.top + Y_SCALE(parseInt(d.y))
				})
				.attr('r', 10)
				.attr('class', 'point')
				.attr('id', (d) => {return'(' + d.x.toString() + ',' + d.y.toString() + ')'
			});


	// function that adds points to the plot (user)
	function add_point() {

		// all console.log are used for debugging
		let x = parseInt(document.getElementById("input_x").value);
		let y = parseInt(document.getElementById("input_y").value);
		
		let id = '(' + x.toString() + ',' + y.toString() + ')';

		FRAME1.append('circle')
				.attr('cx', (d) => {
						return X_SCALE(parseInt(x)) + MARGINS.left
					})
				.attr('cy', (d) => {
						return MARGINS.top + Y_SCALE(parseInt(y))
					})
				.attr('r', 10)
				.attr('class', 'point')
				.attr('id', id);

		let points = FRAME1.selectAll(".point");
		points.on("click", click_point);

	};

	d3.selectAll("#button")
		.on("click", add_point);


	// function that adds/deletes border as user click the point
	// also update the last clicked point in the right column
	function update_border(id) {

		const raw_text = 'Last Point Clicked: ';
		let point = document.getElementById(id);
		let text = document.getElementById("last_point");

		console.log(id);


		// update border
		if (point.border == undefined || point.border == false) {

			console.log('adding')
			point.setAttribute('stroke-width', '4px')
			point.setAttribute('stroke', 'blue')
			point.border = true;
		}

		else {

			console.log('deleting')
			point.removeAttribute('stroke-width')
			point.removeAttribute('stroke')
			point.border = false;
		}

		// update last clicked point
		text.innerHTML = raw_text.concat(id);
	};

	function click_point() {
		console.log(this)
		update_border(this.id)
	};

	points = FRAME1.selectAll(".point");
	points.on("click", click_point);

	FRAME1.append("g")
			.attr("transform", "translate(" + MARGINS.top + "," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(d3.axisBottom(X_SCALE));


	FRAME1.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
			.call(d3.axisLeft(Y_SCALE));

});

const FRAME2 = 
d3.select("#bar_chart")
	.append("svg")
		.attr("height", FRAME_HEIGHT)
		.attr("width", FRAME_WIDTH)
		.attr("class", "bar_frame");



function build_plot() {


	const xScale = d3.scaleBand().range ([0, VIS_WIDTH]).padding(0.2);
	const yScale = d3.scaleLinear().range ([VIS_HEIGHT, 0]);

	d3.csv('data/bar-data.csv').then((data) => {

		
        xScale.domain(data.map(function(d) { return d.category; }));
        yScale.domain([0, d3.max(data, function(d) { return d.amount; })]);

		FRAME2.selectAll('bar_frame')
				.data(data)
				.enter()
				.append('rect')
					.attr('x', function(d) { return xScale(d.category) + MARGINS.left; })
					.attr('y', function(d) { return yScale(d.amount) + MARGINS.top; })
					.attr('width', xScale.bandwidth())
					.attr('height', function(d) { return VIS_HEIGHT - yScale(d.amount); })
					.attr('class', 'bar');


		FRAME2.append("g")
         .attr("transform", 'translate(' + MARGINS.left +
			 ',' + (VIS_HEIGHT + MARGINS.top) + ')')
			.call(d3.axisBottom(xScale).ticks(4))
				.attr('font-size', '20px')


        FRAME2.append("g")
         .attr("transform", 'translate(' + MARGINS.left +
			 ',' + (MARGINS.top) + ')')
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10));



		const TOOLTIP = d3.select('#bar_chart')
							.append('div')
								.attr('class', 'tooltip')
								.style('opacity', 0);

		// mouseover
		function handleMouseover(event, d) {
			TOOLTIP.style("opacity", 1);
		}


		// mousemove
		function handleMousemove(event, d) {
			TOOLTIP.html("Category: " + d.category + "<br>Amount " + d.amount)
					.style("left", (event.pageX + 10) + 'px')
					.style("top", (event.pageY - 50 + 'px'));
		}

		//mouseleave
		function handleMouseleave(event, d) {
			TOOLTIP.style("opacity", 0);
		}

		// add event listeners to points
		FRAME2.selectAll('.bar')
				.on('mouseover', handleMouseover)
				.on('mousemove', handleMousemove)
				.on('mouseleave', handleMouseleave);
	});




};


build_plot();