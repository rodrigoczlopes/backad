/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Department = use('App/Models/Department');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Hierarchy = use('App/Models/Hierarchy');

function list_to_tree(list) {
  const map = {};
  let node;
  const roots = [];
  let i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].value] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== undefined) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

class DepartmentHierarchyController {
  async index({ auth }) {
    const hierarchy = await Hierarchy.query('company_id', auth.user.company_id).fetch();
    if (!hierarchy) return null;

    const departments = await Department.query().where('company_id', auth.user.company_id).orderBy('level').fetch();
    let treeNode = [];
    let parentId = {};
    departments.toJSON().forEach((department) => {
      const level = department.level.split('.');
      const unPreviousLevel = level[level.length - 3];
      const previousLevel = level[level.length - 2];
      const lastLevel = level[level.length - 1];

      parentId = { ...parentId, [`${previousLevel || '00'}.${lastLevel}`]: department.id };

      const item = {
        value: department.id,
        label: department.name,
        children: [],
        parentId: parentId[`${unPreviousLevel || '00'}.${previousLevel}`],
      };
      treeNode = [...treeNode, item];
    });
    return list_to_tree(treeNode);
  }
}

module.exports = DepartmentHierarchyController;
