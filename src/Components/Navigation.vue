<template>
  <header class="flex">
    <div class="branding flex">
      <img src="../assets/file-invoice-dollar-solid.png" alt="" />
    </div>
  </header>
</template>

<script>
  export default {
    name: "navigation",
  };
</script>

<style scoped>
  header {
    z-index: 99;
    flex-direction: column;
    background: #1e2139;
  }
  @media (max-width: 600px) {
    header {
      min-height: 100%;
      min-width: 90px;
      flex-direction: column;
      border-radius: 0 20px 20px 0;
    }
  }
  .branding {
    background-color: #7c5dfa;
    border-radius: 0 20px 20px 0;
    justify-content: center;
    padding: 24px;
  }
  @media (max-width: 600px) {
    .branding {
      width: 70px;
    }
  }
  img {
    width: auto;
    height: 30px;
  }
</style>
