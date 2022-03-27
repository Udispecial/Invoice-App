<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="subitForm" class="invoice-content">
      <Loading v-show="loading" />
      <h1 v-if="!editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            v-model="billerStreetAddress"
            type="text"
            id="billerStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input v-model="billerCity" type="text" id="billerCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              v-model="billerZipCode"
              type="text"
              id="billerZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              v-model="billerCountry"
              type="text"
              id="billerCountry"
              required
            />
          </div>
        </div>
      </div>

      <!-- Bil To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input v-model="clientName" type="text" id="clientName" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input v-model="clientEmail" type="text" id="clientEmail" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Client's Street Address</label>
          <input
            v-model="clientStreetAddress"
            type="text"
            id="clientStreetAddress"
            required
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input v-model="clientCity" type="text" id="clientCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              v-model="clientZipCode"
              type="text"
              id="clientZipCode"
              required
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              v-model="clientCountry"
              type="text"
              id="clientCountry"
              required
            />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              v-model="invoiceDate"
              type="text"
              id="invoiceDate"
              disabled
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input
              v-model="paymentDueDate"
              type="text"
              id="paymentDueDate"
              disabled
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select v-model="paymentTerms" id="paymentTerms" required>
            <option class="hov" value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            v-model="productDescription"
            type="text"
            id="productDescription"
            required
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">
                ${{ (item.total = item.qty * item.price) }}
              </td>
              <img
                @click="deleteInvpoiceItem(item.id)"
                src="../assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>

      <!-- save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editInvoice"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
          >
            Save Draft
          </button>
          <button
            v-if="!editInvoice"
            type="submit"
            @click="publishInvoice"
            class="purple"
          >
            Create Invoice
          </button>
          <button v-if="editInvoice" type="submit" class="purple">
            Update Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import db from "../firebase/firebaseInit";
  import { uid } from "uid";
  import { mapActions, mapMutations, mapState } from "vuex";
  import {
    addDoc,
    doc,
    setDoc,
    collection,
    updateDoc,
  } from "firebase/firestore";
  import Loading from "../Components/Loading.vue";
  //   import { collection } from "@firebase/firestore";
  export default {
    name: "invoiceModal",
    components: { Loading },
    data() {
      return {
        dateOptions: { year: "numeric", month: "short", day: "numeric" },
        docId: null,
        loading: null,
        billerStreetAddress: null,
        billerCity: null,
        billerZipCode: null,
        billerCountry: null,
        clientName: null,
        clientEmail: null,
        clientStreetAddress: null,
        clientCity: null,
        clientZipCode: null,
        clientCountry: null,
        invoiceDateUnix: null,
        invoiceDate: null,
        paymentTerms: null,
        paymentDueDateUnix: null,
        paymentDueDate: null,
        productDescription: null,
        invoicePending: null,
        invoiceDraft: null,
        invoiceItemList: [],
        invoiceTotal: 0,
      };
    },
    created() {
      // get current date for invoice date field
      if (!this.editInvoice) {
        this.invoiceDateUnix = Date.now();
        this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString(
          "en-us",
          this.dateOptions
        );
      }

      if (this.editInvoice) {
        const currentInvoice = this.currentInvoiceArray[0];
        this.docId = currentInvoice.docId;
        this.billerStreetAddress = currentInvoice.billerStreetAddress;
        this.billerCity = currentInvoice.billerCity;
        this.billerZipCode = currentInvoice.billerZipCode;
        this.billerCountry = currentInvoice.billerCountry;
        this.clientName = currentInvoice.clientName;
        this.clientEmail = currentInvoice.clientEmail;
        this.clientStreetAddress = currentInvoice.clientStreetAddress;
        this.clientCity = currentInvoice.clientCity;
        this.clientZipCode = currentInvoice.clientZipCode;
        this.clientCountry = currentInvoice.clientCountry;
        this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
        this.invoiceDate = currentInvoice.invoiceDate;
        this.paymentTerms = currentInvoice.paymentTerms;
        this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
        this.paymentDueDate = currentInvoice.paymentDueDate;
        this.productDescription = currentInvoice.productDescription;
        this.invoicePending = currentInvoice.invoicePending;
        this.invoiceDraft = currentInvoice.invoiceDraft;
        this.invoiceItemList = currentInvoice.invoiceItemList;
        this.invoiceTotal = currentInvoice.invoiceTotal;
      }
    },
    methods: {
      ...mapMutations([
        "TOGGLE_INVOICE",
        "TOGGLE_MODAL",
        "TOGGLE_EDIT_INVOICE",
      ]),
      ...mapActions(["UPDATE_INVOICE", "GET_INVOICE"]),
      checkClick(e) {
        if (e.target === this.$refs.invoiceWrap) {
          this.TOGGLE_MODAL();
        }
      },
      closeInvoice() {
        this.TOGGLE_INVOICE();
        if (this.editInvoice) {
          this.TOGGLE_EDIT_INVOICE();
        }
      },
      addNewInvoiceItem() {
        this.invoiceItemList.push({
          id: uid(),
          itemName: "",
          qty: "",
          price: 0,
          total: 0,
        });
      },
      deleteInvpoiceItem(id) {
        this.invoiceItemList = this.invoiceItemList.filter(
          (item) => item.id !== id
        );
      },
      calInvoiceTotal() {
        this.invoiceTotal = 0;
        this.invoiceItemList.forEach((item) => {
          this.invoiceTotal += item.total;
        });
      },
      publishInvoice() {
        this.invoicePending = true;
      },
      saveDraft() {
        this.invoiceDraft = true;
      },
      saveDraft() {
        this.invoiceDraft = true;
      },

      async uploadInvoice() {
        if (this.invoiceItemList <= 0) {
          alert("please ensure you filled out work items!");
          return;
        }
        this.loading = true;
        this.calInvoiceTotal();
        //         async function getCities(db) {
        //   const citiesCol = collection(db, 'cities');
        //   const citySnapshot = await getDocs(citiesCol);
        //   const cityList = citySnapshot.docs.map(doc => doc.data());
        //   return cityList;
        // }

        var ref = collection(db, "invoices");
        // const dataBase = dataBase(collection(db, "invoices"));
        const docRef = await addDoc(ref, {
          invoiceId: uid(6),
          billerStreetAddress: this.billerStreetAddress,
          billerCity: this.billerCity,
          billerZipCode: this.billerZipCode,
          billerCountry: this.billerCountry,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          clientStreetAddress: this.clientStreetAddress,
          clientCity: this.clientCity,
          clientZipCode: this.clientZipCode,
          clientCountry: this.clientCountry,
          invoiceDate: this.invoiceDate,
          invoiceDateUnix: this.invoiceDateUnix,
          paymentTerms: this.paymentTerms,
          paymentDueDate: this.paymentDueDate,
          paymentDueDateUnix: this.paymentDueDateUnix,
          productDescription: this.productDescription,
          invoiceItemList: this.invoiceItemList,
          invoiceTotal: this.invoiceTotal,
          invoicePending: this.invoicePending,
          invoiceDraft: this.invoiceDraft,
          invoicePaid: null,
        });

        this.loading = false;
        this.TOGGLE_INVOICE();
        this.GET_INVOICE();
      },
      async updateInvoice() {
        if (this.invoiceItemList <= 0) {
          alert("please ensure you filled out work items!");
          return;
        }
        this.loading = true;
        this.calInvoiceTotal();
        //         async function getCities(db) {
        //   const citiesCol = collection(db, 'cities');
        //   const citySnapshot = await getDocs(citiesCol);
        //   const cityList = citySnapshot.docs.map(doc => doc.data());
        //   return cityList;
        // }

        var ref = doc(db, "invoices", this.docId);
        // const dataBase = dataBase(collection(db, "invoices"));
        await updateDoc(ref, {
          billerStreetAddress: this.billerStreetAddress,
          billerCity: this.billerCity,
          billerZipCode: this.billerZipCode,
          billerCountry: this.billerCountry,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          clientStreetAddress: this.clientStreetAddress,
          clientCity: this.clientCity,
          clientZipCode: this.clientZipCode,
          clientCountry: this.clientCountry,
          paymentTerms: this.paymentTerms,
          paymentDueDate: this.paymentDueDate,
          paymentDueDateUnix: this.paymentDueDateUnix,
          productDescription: this.productDescription,
          invoiceItemList: this.invoiceItemList,
          invoiceTotal: this.invoiceTotal,
        });

        this.loading = false;

        const data = {
          docId: this.docId,
          routeId: this.$route.params.invoiceId,
        };

        this.UPDATE_INVOICE(data);
      },
      subitForm() {
        if (this.editInvoice) {
          this.updateInvoice();
          return;
        }
        this.uploadInvoice();
      },
    },
    computed: {
      ...mapState(["editInvoice", "currentInvoiceArray"]),
    },
    watch: {
      paymentTerms() {
        const futureDate = new Date();
        this.paymentDueDateUnix = futureDate.setDate(
          futureDate.getDate() + parseInt(this.paymentTerms)
        );
        this.paymentDueDate = new Date(
          this.paymentDueDateUnix
        ).toLocaleDateString("en-us", this.dateOptions);
      },
    },
  };
</script>

<style scoped>
  .invoice-wrap {
    position: fixed;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100%;
    height: 100vh;
    overflow: scroll;
  }
  .invoice-wrap::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 600px) {
    .invoice-wrap {
      left: 90px;
    }
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .invoice-content h1 {
    margin-bottom: 48px;
    color: #fff;
  }
  .invoice-content h3 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #777f98;
  }
  .invoice-content h4 {
    color: #7c5dfa;
    font-size: 12px;
    margin-bottom: 24px;
  }

  /* bill to/bill from */
  .bill-to,
  .bill-from {
    margin-bottom: 48px;
  }
  .bill-to,
  .bill-from .location-details {
    gap: 16px;
  }
  .bill-to .location-details {
    gap: 16px;
  }
  .location-details div {
    flex: 1;
  }

  /* Invoice work */
  .invoice-work .payment {
    gap: 24px;
  }
  .payment div {
    flex: 1;
  }

  .work-items .item-list {
    width: 100%;
  }
  /* Item Table Styling */
  .work-items .item-list .table-heading,
  .table-items {
    gap: 16px;
    font-size: 12px;
  }
  .table-items .item-name {
    flex-basis: 50%;
  }
  .table-heading .item-name {
    flex-basis: 50%;
  }
  .table-items .qty {
    flex-basis: 10%;
  }
  .table-heading .qty {
    flex-basis: 10%;
  }
  .table-items .price {
    flex-basis: 20%;
  }
  .table-heading .price {
    flex-basis: 20%;
  }
  .table-items .total {
    flex-basis: 20%;
    align-self: center;
  }
  .table-heading .total {
    flex-basis: 20%;
    align-self: center;
  }

  .work-items .table-heading {
    margin-bottom: 16px;
  }
  .work-items .table-heading th {
    text-align: left;
  }

  .work-items .table-items {
    position: relative;
    margin-bottom: 24px;
  }
  .work-items .table-items img {
    position: absolute;
    top: 15px;
    right: 0;
    width: 12px;
    height: 16px;
  }

  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    background-color: #1e2139;
    width: 100%;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
  }
  input,
  select:focus {
    outline: none;
  }
  .button {
    color: #fff;
    background-color: #252945;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .button img {
    margin-right: 4px;
  }
  .save {
    margin-top: 60px;
  }
  .save div {
    flex: 1;
  }
  .save .right {
    justify-content: flex-end;
  }
</style>
