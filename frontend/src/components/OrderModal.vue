<template>
  <b-modal
      id="edit-modal"
      ref="order-modal"
      :title="modalTitle"
      hide-footer
      @shown="onLoad()"
  >
    <form ref="order-form">
      <b-form-group label="Name" label-class="mb-2" label-for="name-input">
        <b-form-input
            id="name-input"
            v-model="$v.name.$model"
            :state="validateState('name')"
        ></b-form-input>
        <b-form-invalid-feedback>Name is required!</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
          class="mt-3"
          label="Max Price"
          label-class="mb-2"
          label-for="max-price-input"
      >
        <b-form-input
            id="max-price-input"
            v-model="$v.maxPrice.$model"
            :state="validateState('maxPrice')"
            type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group
          class="mt-3"
          label="Data Package Type"
          label-class="mb-2"
          label-for="max-price-input"
      >
        <b-form-select
            v-model="$v.selectedValue.$model"
            :state="validateState('selectedValue')"
            class="form-select"
        >
          <template #first>
            <b-form-select-option :value="null" disabled
            >-- Please select an option --
            </b-form-select-option
            >
          </template>
          <b-form-select-option
              v-for="item in dataPackageList"
              :key="item"
              :value="item"
          >{{ item }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
    </form>
    <b-button
        class="mt-3"
        variant="secondary"
        @click="$bvModal.hide('edit-modal')"
    >Cancel
    </b-button
    >
    <b-button
        v-if="type === 'add'"
        class="mt-3"
        style="margin-left: 10px !important"
        variant="primary"
        @click="add()"
    >
      Add
    </b-button>
    <b-button
        v-else
        class="mt-3"
        style="margin-left: 10px !important"
        variant="primary"
        @click="update()"
    >Update
    </b-button>
  </b-modal>
</template>

<script>
import axios from "axios";
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";

export default {
  name: "order-modal",
  mixins: [validationMixin],
  props: {
    type: {
      type: String,
      required: true,
      default() {
        return "";
      },
    },
    selectedData: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      name: "",
      maxPrice: 0,
      dataPackageType: "",
      selectedValue: null,
      dataPackageList: ["Device Location", "Device Behavior", "ID Mapping"],
    };
  },
  validations: {
    name: {
      required,
    },
    maxPrice: {
      required,
    },
    selectedValue: {
      required,
    },
  },
  computed: {
    modalTitle() {
      return this.type.toUpperCase() + " MODAL";
    },
  },
  methods: {
    validateState(name) {
      const {$dirty, $error} = this.$v[name];
      return $dirty ? !$error : null;
    },
    onLoad() {
      if (this.type === "edit") {
        this.name = this.selectedData.name;
        this.maxPrice = this.selectedData.maxPrice;
        this.selectedValue = this.selectedData.dataPackageType;
      } else {
        this.name = "";
        this.maxPrice = 0;
        this.selectedValue = null;
      }
    },
    add() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      let data = {
        name: this.name,
        maxPrice: this.maxPrice,
        dataPackageType: this.selectedValue,
        id: Date.now()
      };
      axios.post("/addOrder", data).then((response) => {
        if (response && response.data.status) {
          let orders = JSON.parse(localStorage.getItem("OrderList")) || [];
          orders.push(data);
          localStorage.setItem("OrderList", JSON.stringify(orders));
          this.$store.dispatch("SET_ORDER_LIST", orders);
          this.$bvToast.toast("Order added successfully.", {
            title: "Successfully added!",
            toaster: "b-toaster-bottom-right",
            variant: "success",
          });
          this.$bvModal.hide('edit-modal')
        } else {
          this.$bvToast.toast(
              "Order failed to add. Please check your settings.",
              {
                title: "Failed to add!",
                toaster: "b-toaster-bottom-right",
                variant: "danger",
              }
          );
        }
      });
    },
    update() {
      axios
          .put("/updateOrder?id=" + this.selectedData.id, this.selectedData)
          .then((response) => {
            if (response && response.data.status) {
              let orders = this.$store.getters.getOrderList
              orders.map(item => {
                if (Number(item.id) === Number(response.data.id)) {
                  item.name = this.name
                  item.maxPrice = this.maxPrice
                  item.dataPackageType = this.selectedValue
                  item.id = response.data.id
                }
              })
              localStorage.setItem("OrderList", JSON.stringify(orders));
              this.$store.dispatch("SET_ORDER_LIST", orders);
              this.$bvToast.toast("Order updated successfully.", {
                title: "Successfully updated!",
                toaster: "b-toaster-bottom-right",
                variant: "success",
              });
              this.$bvModal.hide('edit-modal')
            } else {
              this.$bvToast.toast(
                  "Order failed to update. Please check your settings.",
                  {
                    title: "Failed to add!",
                    toaster: "b-toaster-bottom-right",
                    variant: "danger",
                  }
              );
            }

          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
    },
  },
};
</script>
