import store from '@/store';

/* function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
} */

/* 改造 */
function checkPermission(el, binding) {
    const { value } = binding;
    const all_permission = '*:*:*';
    const permissions = store.getters && store.getters.permissions;

    if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value;

        const hasPermissions = permissions.some(permission => {
            return all_permission === permission || permissionFlag.includes(permission);
        });

        if (!hasPermissions) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    } else {
        throw new Error(`请设置操作权限标签值`);
    }
}

export default {
    inserted(el, binding) {
        checkPermission(el, binding);
    },
    update(el, binding) {
        checkPermission(el, binding);
    }
};
