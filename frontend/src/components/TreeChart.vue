<template>
  <div>
    <div v-if="selectedNode" class="node-details">
      <h2>{{ selectedNode.data.name }}
        <button @click="deselectNode" class="close-btn">×</button>
      </h2>
      <p>{{ selectedNode.data.description }}</p>
    </div>
    <div ref="treeContainer" class="d3-component"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'TreeChart',
  props: {
    data: Object,
  },
  data() {
    return {
      selectedNode: null,
    };
  },
  mounted() {
  this.$nextTick(() => {
    this.renderTreeChart();
  });
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderTreeChart();
      },
    },
  },
  methods: {
    renderTreeChart() {
    // Check if the treeContainer ref is available
    if (!this.$refs.treeContainer) {
      console.error("The tree container is not yet available");
      return;
    }

    // Clear any previous SVG content
    this.$refs.treeContainer.innerHTML = '';

    // Define dimensions and margins
    const margin = { top: 20, right: 120, bottom: 20, left: 120 },
          width = 960 - margin.right - margin.left,
          height = 800 - margin.top - margin.bottom;

    // Create the SVG canvas
    const svg = d3.select(this.$refs.treeContainer).append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Assign data to a hierarchy using parent-child relationships
    let root = d3.hierarchy(this.data, d => d.child_of);
    this.updateStyles();
    // Create the tree layout
    let treeLayout = d3.tree().size([height, width]);
    treeLayout(root);

    var curve_generator = d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; });

    svg.selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr("d",function(d){
        var start = {x:d.source.x,y:d.source.y};
        var end = {x:d.target.x,y:d.target.y};
        return curve_generator({source:start,target:end});})
          .attr("fill","none")
          .attr("stroke","black")
          .attr("stroke-width",3);

    // Draw each node
    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', d => 'node' + (d.child_of ? ' node--internal' : ' node--leaf'))
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Draw the rectangle for each node
    node.append('rect')
      .attr('width', 60)
      .attr('height', 30)
      .attr('x', -30)
      .attr('y', -15)
      .attr('rx', 15)
      .attr('ry', 15)
      .style('fill', '#fff')
      .style('stroke', 'steelblue')
      .style('stroke-width', '3')
      .on('click', (event, d) => {
        this.selectedNode = d;
        //print selected node
        this.updateStyles();
        event.stopPropagation(); // Stop click event from reaching the SVG canvas
      });

    // Add labels for each node
    node.append('text')
      .attr('dy', '.35em')
      .attr('x', 0)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .text(d => d.data.name);
  },
    updateStyles() {
      // Apply styles for nodes
      d3.select(this.$refs.treeContainer).selectAll('rect')
        .style('stroke', d => this.selectedNode && this.selectedNode.data._elementId === d.data._elementId ? 'orange' : 'steelblue')
        .style('stroke-width', d => this.selectedNode && this.selectedNode.data._elementId === d.data._elementId ? '5px' : '3px');

      // Apply styles for selected node
      if (this.selectedNode) {
        const selectedElement = d3.select(this.$refs.treeContainer).select('rect.selected').node();
        if (selectedElement) selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    selectNode(d) {
      this.selectedNode = this.selectedNode === d ? null : d;
      this.updateStyles();
    },
    deselectNode() {
      this.selectedNode = null;
      this.updateStyles();
    },
  },
};
</script>

<style lang="scss" scoped>
$stroke-width: 3px;
$selected-stroke-width: 5px;
$node-fill: #fff;
$node-stroke: steelblue;
$selected-stroke: orange;

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

.node {
  & rect {
    cursor: pointer;
    fill: $node-fill;
    stroke: $node-stroke;
    stroke-width: $stroke-width;
  }

  &.selected rect {
    stroke: $selected-stroke;
    stroke-width: $selected-stroke-width;
  }

  & text {
    font: 12px sans-serif;
    user-select: none;
  }

  &--internal rect {
    fill: lightsteelblue;
  }

  &--leaf rect {
    fill: $node-fill;
  }
}

.node-details {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  top: 20px;
  left: 20px;
  z-index: 10;

  h2 {
    font-size: 1.2em;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    margin: 0.5em 0 0;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
