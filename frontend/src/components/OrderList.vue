<template>
  <div class="main-container">
    <Order-modal :type="type" :selected-data="selectedItem"></Order-modal>
    <div class="order-table">
      <div class="table-filters d-flex">
        <b-button class="mb-3" variant="primary" @click="addOrder()">Add Order</b-button>
      </div>
      <b-table :fields="headers" :items="orderList" hover striped show-empty>
        <template v-slot:cell(actions)="items">
          <div class="table_icons text-center">
            <b-icon icon="pencil-square" title="Edit" variant="primary" @click="editOrder(items.item,'edit')"></b-icon>
            <b-icon icon="trash" title="Remove" variant="danger" @click="removeItem(items.item)"></b-icon>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import OrderModal from './OrderModal.vue'
import axios from "axios";

export default {
  name: 'order-list',
  components: {
    OrderModal
  },
  data() {
    return {
      type: '',
      selectedItem: {},
      headers: [
        {
          key: "name",
        },
        {
          key: "maxPrice",
        },
        {
          key: "dataPackageType",
        },
        {
          key: "actions",
          tdClass: "text-center",
          thClass: "text-center",
        },
      ],
    }
  },
  computed:{
    orderList(){
       return this.$store.getters.getOrderList
    }
  },
  methods: {
    editOrder(item, type) {
      this.type = type
      this.selectedItem = item
      this.$bvModal.show('edit-modal')
    },
    removeItem(item){
      axios.delete("/removeOrder?id="+item.id).then((response) => {
        if (response && response.data.status) {
         let index = this.orderList.findIndex(item => item.id ===response.data.id);
          this.orderList.splice(index,1)
          localStorage.setItem("OrderList", JSON.stringify( this.orderList));
          this.$store.dispatch("SET_ORDER_LIST",  this.orderList);
          this.$bvToast.toast("Order removed successfully.", {
            title: "Successfully removed!",
            toaster: "b-toaster-bottom-right",
            variant: "success",
          });
          this.$bvModal.hide('edit-modal')
        } else {
          this.$bvToast.toast(
              "Order failed to remove. Please check your settings.",
              {
                title: "Failed to remove!",
                toaster: "b-toaster-bottom-right",
                variant: "danger",
              }
          );
        }
      });
    },
    addOrder() {
      this.type = 'add'
      this.$bvModal.show('edit-modal')
    }
  }
}
</script>

