import '../styles/react-treeview.css';
import React, { Component, PropTypes } from 'react';
import TreeView from 'react-treeview';
import { Link } from 'react-router';
import { generateTreeStructure } from '../utils';

function generateTreeView(groups) {
  return groups.map(group => {
    const nodeLabel = <Link to={`/admin/groups/${group.id}/settings`}>{group.name}</Link>;
    if (group.children.length) {
      return (
        <TreeView key={group.id} nodeLabel={nodeLabel} defaultCollapsed={false}>
          {generateTreeView(group.children)}
        </TreeView>
      );
    }

    return (
      <div key={group.id} className='GroupTree__sidebar__info'>
        {nodeLabel}
      </div>
    );
  });
}

export default class GroupTree extends Component {

  static propTypes = {
    groups: PropTypes.array
  };

  render() {
    const { groups } = this.props;
    const tree = generateTreeStructure(groups);

    return (
      <div className='GroupTree__sidebar'>
        <h3>Groups</h3>
        {generateTreeView(tree)}
      </div>
    );
  }
}
