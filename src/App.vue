<template>
  <div v-if="invoicesLoaded">
    <div class="app flex">
      <Navigation />
      <div class="app-content flex">
        <Modal v-if="modalActive" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import Navigation from "./Components/Navigation.vue";
  import InvoiceModal from "./Components/InvoiceModal.vue";
  import Modal from "./Components/Modal.vue";
  export default {
    components: {
      Navigation,
      InvoiceModal,
      Modal,
    },
    created() {
      this.GET_INVOICE();
    },
    methods: {
      ...mapActions(["GET_INVOICE"]),
    },
    computed: {
      ...mapState(["invoiceModal", "modalActive", "invoicesLoaded"]),
    },
  };
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  .app {
    background-color: #141625;
    min-height: 100vh;
  }
  @media (max-width: 600px) {
    .app {
      flex-direction: column !important;
    }
  }
  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }

  /* animated invoice */
  .invoice-enter-active,
  .invoice-leave-active {
    transition: 0.8s ease all;
  }
  .invoice-enter-from,
  .invoice-leave-to {
    transform: translateX(-700px);
  }

  button,
  .button {
    cursor: pointer;
    padding: 16px 24px;
    border-radius: 30px;
    border: none;
    font-size: 12px;
    margin-right: 8px;
    color: #fff;
  }

  .dark-purple {
    background-color: #252945;
  }

  .red {
    background-color: #ec5757;
  }

  .purple {
    background-color: #7c5dfa;
  }

  .green {
    background-color: #33d69f;
  }

  .orange {
    background-color: #ff8f00;
  }

  /* utility classes */
  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .container {
    width: 100%;
    padding: 40px 10px;
    max-width: 850px;
    margin: 0 auto;

    @media (min-width: 900px) {
      padding-top: 72px;
    }
  }

  .nav-link {
    text-decoration: none;
    color: initial;
  }

  /* Status Button Styling  */
  .status-button {
    font-size: 12px;
    margin-right: 30px;
    align-items: center;
    padding: 8px 30px;
    border-radius: 10px;
  }
  .status-button::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .paid {
    color: #33d69f;
    background-color: rgba(51, 214, 160, 0.1);
  }
  .paid::before {
    background-color: #33d69f;
  }

  .pending {
    color: #ff8f00;
    background-color: rgba(255, 145, 0, 0.1);
  }
  .pending::before {
    background-color: #ff8f00;
  }

  .draft {
    color: #dfe3fa;
    background-color: rgba(223, 227, 250, 0.1);
  }
  .draft::before {
    background-color: #dfe3fa;
  }
</style>
