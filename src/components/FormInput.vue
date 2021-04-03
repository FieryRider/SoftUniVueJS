<template>
  <section class="form-field">
    <label v-if="!['button', 'reset', 'submit'].includes(type)" :for="'input-' + name">{{ label }}</label>
    <input :type="type" :id="'input-' + name" :name="name" 
      v-model="model"
      @input="v.$touch()"
      v-if="['date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'text', 'time', 'url', 'week'].includes(type)"
      :class="{ 'bg-danger': v.$error }">
    <textarea :id="'input-' + name" :name="name" :rows="rows" :cols="cols"
      v-model="model"
      @input="v.$touch()"
      v-else-if="type == 'textarea'"
      :class="{ 'bg-danger': v.$error }">
    </textarea>
    <select :id="'input-' + name" :name="name" 
      v-model="model"
      @input="v.$touch()"
      v-else-if="type == 'select'"
      :class="{ 'bg-danger': v.$error }">
      <option v-for="opt in options" :value="opt.value" :key="opt.objectId">{{ opt.text }}</option>
    </select>
    <select :id="'input-' + name" :name="name" 
      multiple
      v-model="model"
      @input="v.$touch()"
      v-else-if="type == 'multipleSelect'"
      :class="{ 'bg-danger': v.$error }">
      <option v-for="opt in options" :value="opt.value" :key="opt.objectId">{{ opt.text }}</option>
    </select>
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
  props: {
    type: String,
    label: {
      type: String,
      required: false
    },
    name: String,
    value: undefined,
    errorMessages: Object,
    v: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: false
    },
    rows: {
      type: Number,
      required: false
    },
    cols: {
      type: Number,
      required: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
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

<style>
input[type='text'],
input[type='password'],
input[type='number'],
input[type='date'],
input[type='email'] {
  width: 100%;
  margin: 4px 0;
  padding: 4px 16px;
  border-color: #ced4da;
  border-radius: .25rem;
  border-width: 1px;
  border-style: solid;
  line-height: 2;
  color: #555;
}
textarea {
  margin: 4px 0;
  padding: 4px 16px;
  border-color: #ced4da;
  border-radius: .25rem;
  border-width: 1px;
  border-style: solid;
  color: #555;
}
input[type='text']:focus,
input[type='password']:focus,
input[type='number']:focus,
input[type='date']:focus,
input[type='email']:focus,
textarea:focus {
  border-color: rgba(150, 150, 150, 0.8);
  box-shadow: 0 1px 1px rgba(150, 150, 150, 0.075) inset, 0 0 8px rgba(150, 150, 150, 0.6);
  outline: 0 none;
}
select {
  min-width: 200px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  scrollbar-width: thin;
}
select option {
  padding: 5px;
  border-radius: 3px;
}
</style>
