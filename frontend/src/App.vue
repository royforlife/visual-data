<template>
  <div id="app">
    <tree-chart :data="treeData"></tree-chart>
  </div>
</template>

<script>
import TreeChart from './components/TreeChart.vue';
const url = process.env.VUE_APP_URL || '/api';
export default {
  name: 'App',
  components: {
    TreeChart
  },
  data() {
    return {
      treeData: null
    };
  },
  created() {
    this.fetchTreeData();
  },
  methods: {
    async fetchTreeData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching tree data');
        const data = await response.json();
        this.treeData = this.processData(data);
      } catch (error) {
        console.error('Could not fetch tree data:', error);
      }
    },
    processData(data) {
      if (!data || !data.length) {
        console.error('No data to process');
        return null;
      }
      return data[0];
    }
  }
};
</script>
