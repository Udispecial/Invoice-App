<template>
  <div v-if="currentInvoice" class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <Loading v-show="loading" />
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
          }"
        >
          <span v-if="currentInvoice.invoicePaid">Paid</span>
          <span v-if="currentInvoice.invoiceDraft">Draft</span>
          <span v-if="currentInvoice.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice" class="dark-purple">Edit</button>
        <button @click="deleteInvoice(currentInvoice.docId)" class="red">
          Delete
        </button>
        <button
          @click="updateStatusToPaid(currentInvoice.docId)"
          v-if="currentInvoice.invoicePending"
          class="green"
        >
          Mark as Paid
        </button>
        <button
          @click="updateStatusToPending(currentInvoice.docId)"
          class="orange"
          v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
        >
          Mark as Pending
        </button>
      </div>
    </div>

    <!-- Invoice details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
          <p>{{ currentInvoice.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ currentInvoice.billerStreetAddress }}</p>
          <p>{{ currentInvoice.billerCity }}</p>
          <p>{{ currentInvoice.billerZipCode }}</p>
          <p>{{ currentInvoice.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>{{ currentInvoice.invoiceDate }}</p>
          <h4>payment Date</h4>
          <p>{{ currentInvoice.paymentDueDate }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ currentInvoice.clientName }}</p>
          <p>{{ currentInvoice.clientStreetAddress }}</p>
          <p>{{ currentInvoice.clientCity }}</p>
          <p>{{ currentInvoice.clientZipCode }}</p>
          <p>{{ currentInvoice.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Sent To</h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div
            v-for="(item, index) in currentInvoice.invoiceItemList"
            :key="index"
            class="item flex"
          >
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ currentInvoice.invoiceTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from "../Components/Loading.vue";
  import { mapActions, mapMutations, mapState } from "vuex";
  export default {
    name: "invoiceView",
    components: { Loading },
    data() {
      return {
        currentInvoice: null,
        loading: null,
      };
    },
    created() {
      this.getCurrentInvoice();
    },
    methods: {
      ...mapMutations([
        "SET_CURRENT_INVOICE",
        "TOGGLE_INVOICE",
        "TOGGLE_EDIT_INVOICE",
      ]),
      ...mapActions([
        "DELETE_INVOICE",
        "UPDATE_STATUS_TO_PENDING",
        "UPDATE_STATUS_TO_PAID",
      ]),
      getCurrentInvoice() {
        this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
        this.currentInvoice = this.currentInvoiceArray[0];
      },
      toggleEditInvoice() {
        this.TOGGLE_EDIT_INVOICE();
        this.TOGGLE_INVOICE();
      },
      async deleteInvoice(docId) {
        this.loading = true;
        await this.DELETE_INVOICE(docId);
        this.loading = false;
        this.$router.push({ name: "home" });
      },
      updateStatusToPaid(docId) {
        this.loading = true;
        this.UPDATE_STATUS_TO_PAID(docId);
        this.loading = false;
      },
      updateStatusToPending(docId) {
        this.UPDATE_STATUS_TO_PENDING(docId);
      },
    },
    computed: {
      ...mapState(["currentInvoiceArray", "editInvoice"]),
    },
    watch: {
      editInvoice() {
        if (!this.editInvoice) {
          this.currentInvoice = this.currentInvoiceArray[0];
        }
      },
    },
  };
</script>

<style scoped>
  .invoice-view .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
  }
  .invoice-view .nav-link img {
    margin-right: 16px;
    width: 7px;
    height: 10px;
  }
  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }
  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;
  }
  .header .left {
    align-items: center;
  }
  .header .left span {
    color: #dfe3fa;
    margin-right: 16px;
  }
  .header .right {
    flex: 1;
    justify-content: flex-end;
  }
  .header .right button {
    color: #fff;
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;
  }
  .invoice-details .top div {
    color: #dfe3fa;
    flex: 1;
  }
  .invoice-details .top .left {
    font-size: 12px;
  }
  .invoice-details .top .left p:first-child {
    font-size: 24px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 8px;
  }
  .invoice-details .top .left p:nth-child(2) {
    font-size: 16px;
  }
  .invoice-details .top .left p:nth-child(2) span {
    color: #888eb0;
  }
  .invoice-details .top .right {
    font-size: 12px;
    align-items: flex-end;
  }
  .invoice-details .middle {
    margin-top: 50px;
    gap: 16px;
    color: #dfe3fa;
  }
  .invoice-details .middle h4 {
    font-size: 12px;
    font-weight: 400px;
    margin-bottom: 12px;
  }
  .invoice-details .middle p {
    font-size: 16px;
  }
  .invoice-details .middle .bill,
  .payment {
    flex: 1;
  }
  .invoice-details .middle .payment h4:nth-child(3) {
    margin-top: 32px;
  }
  .invoice-details .middle .payment p {
    font-weight: 600px;
  }
  .invoice-details .middle .bill p:nth-child(2) {
    font-size: 16px;
  }
  .invoice-details .middle .bill p:nth-child(3) {
    margin-top: auto;
  }
  .invoice-details .middle .bill p {
    font-size: 12px;
  }
  .invoice-details .middle .send-to {
    flex: 2;
  }
  .invoice-details .bottom {
    margin-top: 50px;
  }
  .invoice-details .bottom .billing-items {
    border-radius: 20px 20px 0 0;
    padding: 32px;
    background-color: #252945;
  }
  .invoice-details .bottom .billing-items .heading {
    color: #dfe3fa;
    font-size: 12px;
    margin-bottom: 32px;
  }
  .invoice-details .bottom .billing-items .heading p:first-child {
    flex: 3;
    text-align: left;
  }
  .invoice-details .bottom .billing-items .heading p {
    flex: 1;
    text-align: right;
  }
  .invoice-details .bottom .billing-items .item {
    margin-bottom: 32px;
    font-size: 13px;
    color: #fff;
  }
  .invoice-details .bottom .billing-items .item:last-child {
    margin-bottom: 0;
  }
  .invoice-details .bottom .billing-items .item p:first-child {
    flex: 3;
    text-align: left;
  }
  .invoice-details .bottom .billing-items .item p {
    flex: 1;
    text-align: right;
  }
  .invoice-details .bottom .total {
    padding: 32px;
    color: #fff;
    background-color: rgba(12, 14, 22, 0.7);
    align-items: center;
    border-radius: 0 0 20px 20px;
  }
  .invoice-details .bottom .total p {
    flex: 1;
    font-size: 12px;
  }
  .invoice-details .bottom .total p:nth-child(2) {
    font-size: 28px;
    text-align: right;
  }
</style>
