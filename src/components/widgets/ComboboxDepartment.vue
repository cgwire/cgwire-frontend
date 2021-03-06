<template>
<div class="field">
  <label class="label" v-if="label.length > 0">
    {{ label }}
  </label>
  <div
    class="department-combo"
  >
    <div
      class="flexrow"
      @click="toggleDepartmentList"
    >
      <div
        class="selected-department-line flexrow-item" v-if="currentDepartment"
      >
        <department-name
          :department="currentDepartment"
        />
      </div>
      <chevron-down-icon class="down-icon flexrow-item"/>
    </div>
    <div
      class="select-input"
      ref="select"
      v-if="showDepartmentList"
    >
      <div
        class="department-line"
        v-for="department in departmentList"
        @click="selectDepartment(department)"
        :key="department.id"
      >
        <department-name
          :department="department"
        />
      </div>
    </div>
  </div>
  <combobox-mask
    :displayed="showDepartmentList"
    @click="toggleDepartmentList"
  />
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import { ChevronDownIcon } from 'vue-feather-icons'

import ComboboxMask from '@/components/widgets/ComboboxMask'
import DepartmentName from '@/components/widgets/DepartmentName'

export default {
  name: 'combobox-department',
  components: {
    ChevronDownIcon,
    ComboboxMask,
    DepartmentName
  },

  data () {
    return {
      showDepartmentList: false
    }
  },

  props: {
    label: {
      default: '',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    selectableDepartments: {
      type: Array,
      required: false
    }
  },

  mounted () {
  },

  computed: {
    ...mapGetters([
      'departmentMap',
      'departments'
    ]),

    departmentsToTakeAccount () {
      if (this.selectableDepartments) return this.selectableDepartments
      return this.departments
    },

    departmentList () {
      return [{ name: '---', id: null, color: '#000000' }, ...this.departmentsToTakeAccount]
    },

    currentDepartment () {
      if (this.value) {
        return this.departmentMap.get(this.value)
      } else {
        return this.departmentList[0]
      }
    }
  },

  methods: {
    selectDepartment (department) {
      this.$emit('input', department.id)
      this.showDepartmentList = false
    },

    toggleDepartmentList () {
      this.showDepartmentList = !this.showDepartmentList
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .select-input,
  .selected-department-line,
  .department-line,
  .department-combo {
    background: $dark-grey-light;
    border-color: $dark-grey;
  }

  .department-line:hover {
    background: $dark-purple;
  }
}

.department-line {
}

.department-combo {
  background: $white;
  min-width: 200px;
  width: 200px;
  border: 1px solid $light-grey-light;
  user-select: none;
  cursor: pointer;
  border-radius: 3px;
  margin: 0;
  padding: 0.15em;
  position: relative;
}

.department-combo:hover {
  border: 1px solid $green;
}

.selected-department-line {
  background: $white;
  padding: 0.4em;
  flex: 1;
}

.department-line {
  background: $white;
  cursor: pointer;
  padding: 0.4em;
  margin: 0;

  &:hover {
    background: $purple;
  }
}

.down-icon {
  width: 15px;
  min-width: 15px;
  margin-right: 0.4em;
  color: $green;
  cursor: pointer;
}

.select-input {
  background: $white;
  width: 200px;
  position: absolute;
  border: 1px solid $light-grey-light;
  z-index: 300;
  margin-left: -1px;
  max-height: 200px;
  overflow-y: auto;
}

.field .label {
  padding-top: 5px;
}
</style>
