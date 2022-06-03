<template>
  <div id="app">
    <b-container>
      <div class="logo">
        <img alt="Narrative logo" src="https://www.narrative.io/hs-fs/hubfs/narrative%20logo%20150.png?width=130&name=narrative%20logo%20150.png">
        <h3>Order Management</h3>
      </div>
      <order-list></order-list>
    </b-container>

  </div>
</template>

<script>
import OrderList from './components/OrderList.vue'
import axios from "axios";
export default {
  name: 'App',
  components: {
    OrderList
  },
  created() {
    axios.get("/getOrders").then((response) => {
      if (response && response.data.status) {
        let orders = JSON.parse(localStorage.getItem("OrderList")) || [];
        this.$store.dispatch('SET_ORDER_LIST',orders)
      } else {
        this.$store.dispatch('SET_ORDER_LIST',[])
      }
    });
    let orders = JSON.parse(localStorage.getItem("OrderList")) || [];
    this.$store.dispatch('SET_ORDER_LIST',orders)
  }
}
</script>

<style lang="scss">
@import "./assets/style/app.scss";
</style>