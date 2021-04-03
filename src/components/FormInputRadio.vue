<template>
  <section>
    <input type="radio" :id="'input-' + name" :name="name" 
      v-model="model"
      :value="value"
      :class="{ 'bg-danger': v.$error }">
    <label :for="'input-' + name">{{ label }}</label>
    <div class="error" 
      v-if="v.$error">
      <p
        v-for="(err, index) in errors"
        :key="index">{{ errorMessages[err] }}</p>
    </div>
  </section>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "change"
  },
  props: {
    label: {
      type: String,
      required: false
    },
    name: String,
    modelValue: String,
    value: String,
    errorMessages: Object,
    v: {
      type: Object,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.v.$touch()
        this.$emit("change", value)
      }
    },
    errors: function() {
      return Object.entries(this.v)
        .filter(validation => !validation[0].startsWith("$") && !validation[1])
        .map(validation => validation[0])
    }
  }
}
</script>

<style scoped>
section {
  display: flex;
  align-items: center;
}
section *:hover {
  cursor: pointer;
}
label {
  margin-left: 5px;
}
</style>
